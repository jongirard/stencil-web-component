import { Component, Prop, State, h } from '@stencil/core';
import axios from 'axios';
import { orderBy, filter, flattenDeep } from 'lodash-es';
import { css, injectGlobal } from 'emotion';
import moment from 'moment';

@Component({
  tag: 'programs-api',
  styleUrl: 'programs-api.css',
  shadow: true
})

export class ProgramsApi {
  @Prop() organization_id: string;
  @Prop() organization_name: string = "";
  @Prop() color: string;
  @Prop() enrol_button_color: string;
  @Prop() checkbox_color: string;
  @Prop() programs_height: string;

  @State() programs: Array<object> = [];
  //Program Types
  @State() program_types: Array<any> = [];
  @State() loading: boolean = false;

  componentWillLoad() {
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    axios.get(`https://gmde73l542.execute-api.us-east-1.amazonaws.com/prod/programs/public/${this.organization_id}`)
      .then((response) => {
        // handle success
        this.programs = response.data;

        this.loading = false;
        this.setProgramTypes();
      });
      this.setProgramTypes();
    }

  setProgramTypes() {
    let types = [];
    this.programs.map((program: any) => {
      let alreadyAdded = !!filter(types, { name: program.type }).length;

      if (alreadyAdded === false) {
        types.push({ name: program.type, checked: false });
      }
    })

    const sortedTypes = orderBy(types, ['name'], ['desc'])
    this.program_types = sortedTypes;
  }

  updateProgramTypes(type: any, key: number) {
    let programTypesClone = [ ...this.program_types ];

    programTypesClone[key].checked = !type.checked;
    this.program_types = programTypesClone;
  }

  renderProgramTypes() {

    const checkboxStyles = css`
      &:hover + label:before {
        background-color: #000 !important;
      }
      &:checked + label:before {
        background-color: #000 !important;
      }
    `

    if (this.loading) {
      return (
        <div class='loading-spinner'>
          <div class='spinner'></div>
        </div>
      );
    }

    return this.program_types.map((type: any, key: number) =>
      <div class='row'>
        <input
          class={`styled-checkbox ${checkboxStyles}`}
          name='program_type'
          type='checkbox'
          value={type.name}
          checked={this.program_types[key].checked}
          onClick={() => this.updateProgramTypes(type, key)}
        />
        <label onClick={() => this.updateProgramTypes(type, key)}>{type.name}</label>
      </div>
    );
  }

  renderPrograms() {
    let filteredResults = [];
    const openPrograms = filter(this.programs, (program) => { return moment(program.registration_end_date).isAfter() === true })

    this.program_types.forEach((type) => {
      if (type.checked === true) {
        filteredResults.push(filter(openPrograms, (program) => { return program.type === type.name }))
      }
    })

    filteredResults = flattenDeep(filteredResults)

    if (filteredResults.length === 0) {
      return (
        <div class='empty-message'>No results. Select a program or refine your pick.</div>
      )
    }

    return filteredResults.map((program: any) => {
      return (
        <programs-accordion program={program} organization_id={this.organization_id} organization_name={this.organization_name} color={this.color} enrol_button_color={this.enrol_button_color} />
      )
    })
  }

  render() {
    // <div class='debug-program-id'>Program ID {this.organization_id}</div>

    injectGlobal`
      :root {
        --header-hover-color: ${this.color ? this.color : '#8b8d94'};
        --enrol-button-color: ${this.enrol_button_color ? this.enrol_button_color : '#000'};
        --checkbox-color: ${this.checkbox_color ? this.checkbox_color : '#000'};
        --programs-height: ${this.programs_height ? this.programs_height : '350px'};
      }
    `

    return (
      <div class="programs--programs-api" id="programs-api-component">
        <div class='programs-container'>
          <div class='programs-columns'>
            <div class='column types-column'>
              <div class='sticky'>
                <div class='programs-header-type-wrapper'>
                  <div class='programs-header sub-header'>Program Type</div>
                    <div class='programs-type'>
                      {this.renderProgramTypes()}
                    </div>
                  </div>
                </div>
              </div>
            <div class='column accordions'>
              {this.renderPrograms()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
