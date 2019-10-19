import { Component, Prop, State, h } from '@stencil/core';
import axios from 'axios';
import { sortBy, filter, flattenDeep } from 'lodash-es';
import {css} from 'emotion';

@Component({
  tag: 'programs-api',
  styleUrl: 'programs-api.css',
  shadow: false
})

export class ProgramsApi {
  @Prop() organization: string;
  @Prop() color: string;

  @State() programs: Array<object> = [];
  //Program Types
  @State() program_types: Array<any> = [];
  @State() loading: boolean = false;

  componentWillLoad() {
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    axios.get(`https://wdq57lq1u6.execute-api.us-east-1.amazonaws.com/test/programs/public/${this.organization}`)
      .then((response) => {
        // handle success
        this.programs = response.data;

        this.loading = false;
        this.setProgramTypes();
      });
    }

  setProgramTypes() {
    let types = [];
    this.programs.map((program: any) => {
      let alreadyAdded = !!filter(types, { name: program.type }).length;

      if (alreadyAdded === false) {
        types.push({ name: program.type, checked: false });
      }
    })

    const sortedTypes = sortBy(types, ['name'])
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
        background-color: ${this.color} !important;
      }
      &:checked + label:before {
        background-color: ${this.color} !important;
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
          class={`styled-checkbox`}
          name='program_type'
          type='checkbox'
          value={type.name}
          checked={this.program_types[key].checked}
          onClick={() => this.updateProgramTypes(type, key)}
        />
        <label>{type.name}</label>
      </div>
    );
  }

  renderPrograms() {
    let filteredResults = [];

    this.program_types.forEach((type) => {
      console.log('type', type)
      if (type.checked === true) {
        filteredResults.push(filter(this.programs, (program) => { return program.type === type.name }))
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
        <programs-accordion program={program} color={this.color} />
      )
    })
  }

  render() {
    console.log('fetched data in render', this.programs);

    return (
      <div>
        <div class='debug-program-id'>Program ID {this.organization}</div>
        <div class='programs-container'>
          <div class='programs-columns'>
            <div class='column types-column'>
              <div class='sticky'>
                <div class='programs-header' style={{color: this.color}}>Programs for you</div>
                {this.renderProgramTypes()}
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
