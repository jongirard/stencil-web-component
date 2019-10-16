import { Component, Prop, State, h } from '@stencil/core';
import axios from 'axios';
import { sortBy, filter, flattenDeep } from 'lodash-es';

// const SEASONS = [
//   { name: 'winter', months: ['Jan', 'Feb', 'Mar']},
//   { name: 'spring', months: ['Apr', 'May', 'Jun']},
//   { name: 'summer', months: ['Jul', 'Aug', 'Sep']},
//   { name: 'fall', months: ['Oct', 'Nov', 'Dec']},
// ]

@Component({
  tag: 'programs-api',
  styleUrl: 'programs-api.css',
  shadow: true
})

export class ProgramsApi {
  @Prop() organization: string;
  @Prop() color: string;

  @State() programs: Array<object> = [];
  //Seasons
  // @State() winter: boolean = false;
  // @State() spring: boolean = false;
  // @State() summer: boolean = false;
  // @State() fall: boolean = false;
  //Program Types
  @State() program_types: Array<any> = [];

  componentWillLoad() {
    this.fetchData();
  }

  fetchData() {
    axios.get(`https://wdq57lq1u6.execute-api.us-east-1.amazonaws.com/test/programs/public/${this.organization}`)
      .then((response) => {
        // handle success
        this.programs = response.data;

        this.setProgramTypes();
      });
    }

  // renderSeasonCheckboxes() {
  //   return SEASONS.map((season: any) =>
  //     <div class='row'>
  //       <input
  //         type="checkbox"
  //         name={season.name}
  //         class='season-checkbox'
  //         value={season.name}
  //         checked={this[season.name]}
  //         onClick={() => this[season.name] = !this[season.name]}
  //       />
  //       <span class='season-name'>{season.name}</span>
  //       <div class='season-months'>({season.months.join(', ')})</div>
  //     </div>
  //   )
  // }

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

    return this.program_types.map((type: any, key: number) =>
      <div class='row'>
        <input
          type="checkbox"
          name="program_type"
          class='type-checkbox'
          value={type.name}
          checked={this.program_types[key].checked}
          onClick={() => this.updateProgramTypes(type, key)}
        />
        <span class='type-name'>{type.name}</span>
      </div>
    );
  }

  renderPrograms() {
    let filteredResults = [];

    // if (this.winter === true) {
    //   filteredResults.push(filter(this.programs, (program) => { return program.season.indexOf('winter') >= 0}))
    // }
    // if (this.spring === true) {
    //   filteredResults.push(filter(this.programs, (program) => { return program.season.indexOf('spring') >= 0}))
    // }
    // if (this.summer === true) {
    //   filteredResults.push(filter(this.programs, (program) => { return program.season.indexOf('summer') >= 0}))
    // }
    // if (this.fall === true) {
    //   filteredResults.push(filter(this.programs, (program) => { return program.season.indexOf('fall') >= 0}))
    // }

    this.program_types.forEach((type) => {
      console.log('type', type)
      if (type.checked === true) {
        filteredResults.push(filter(this.programs, (program) => { return program.type === type.name }))
      }
    })

    filteredResults = flattenDeep(filteredResults)

    return filteredResults.map((program: any) => {
      return (
        <programs-accordion program={program} />
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
