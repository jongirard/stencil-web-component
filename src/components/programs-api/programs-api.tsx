import { Component, Prop, State, h } from '@stencil/core';
import axios from 'axios';
import { sortBy, filter } from 'lodash-es';
import moment from 'moment';

const SEASONS = [
  { name: 'winter', months: ['Jan', 'Feb', 'Mar']},
  { name: 'spring', months: ['Apr', 'May', 'Jun']},
  { name: 'summer', months: ['Jul', 'Aug', 'Sep']},
  { name: 'fall', months: ['Oct', 'Nov', 'Dec']},
]

@Component({
  tag: 'programs-api',
  styleUrl: 'programs-api.css',
  shadow: true
})

export class ProgramsApi {
  @Prop() organization: string;

  @State() programs: Array<object> = [];
  //Seasons
  @State() winter: boolean = false;
  @State() spring: boolean = false;
  @State() summer: boolean = false;
  @State() fall: boolean = false;
  //Program Types
  @State() program_types: Array<object> = [];

  componentWillLoad() {
    this.fetchData();
  }

  fetchData() {
    axios.get(`https://wdq57lq1u6.execute-api.us-east-1.amazonaws.com/test/programs/public/${this.organization}`)
      .then((response) => {
        // handle success
        //console.log(response);
        this.programs = response.data;

        this.setProgramTypes();
      });
    }

  renderSeasonCheckboxes() {
    return SEASONS.map((season) =>
      <div class='row'>
        <input
          type="checkbox"
          name={season.name}
          class='season-checkbox'
          value={season.name}
          checked={this[season.name]}
          onClick={() => this[season.name] = !this[season.name]}
        />
        <span class='season-name'>{season.name}</span>
        <div class='season-months'>({season.months.join(', ')})</div>
      </div>
    )
  }

  setProgramTypes() {
    let types = [];
    this.programs.map((program) => {
      let snakeCase = program.type.toLowerCase().split(' ').join('_');
      let alreadyAdded = !!filter(types, { name: snakeCase }).length;

      if (alreadyAdded === false) {
        types.push({ name: snakeCase, checked: false });
      }
    })

    const sortedTypes = sortBy(types, ['name'])
    this.program_types = sortedTypes;
  }

  updateProgramTypes(type, key) {
    let programTypesClone = [ ...this.program_types ];

    programTypesClone[key].checked = !type.checked;
    this.program_types = programTypesClone;
  }

  renderProgramTypes() {

    return this.program_types.map((type, key) =>
      <div class='row'>
        <input
          type="checkbox"
          name={type.name}
          class='type-checkbox'
          value={type.name}
          checked={this.program_types[key].checked}
          onClick={() => this.updateProgramTypes(type, key)}
        />
        <span class='type-name'>{type.name.split('_').join(' ')}</span>
      </div>
    );
  }

  renderPrograms() {
    return this.programs.map((program) =>
      <div class='accordion'>
        <div class='accordion-header'>
          <div class='title'>{`${program.ages} ${program.division} ${program.program_description}`}</div>
          <div class='dates'>Start - End</div>
        </div>
      </div>
    )
  }

  render() {
    console.log('fetched data in render', this.programs);
    console.log('winter season state', this.winter);
    console.log('spring season state', this.spring);
    console.log('summer season state', this.summer);
    console.log('fall season state', this.fall);

    console.log('program types state', this.program_types);

    //this.setProgramTypes()
    //console.log('program types state', this.program_types);

    return (
      <div>
        Hello, World! I'm {this.organization}
        <div class='programs-container'>
          <div class='column seasons-column'>
            {this.renderSeasonCheckboxes()}
          </div>
          <div class='column types-column'>
          {this.renderProgramTypes()}
          </div>
          <div class='accordions'>
          {this.renderPrograms()}
          </div>
        </div>
      </div>
    )

    // return this.programs.forEach((program) => {
    //   return (
    //     <div>{program.ages}</div>
    //   )
    // })
  }
}
