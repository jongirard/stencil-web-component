import { Component, Prop, State, h } from '@stencil/core';
import moment from 'moment';

@Component({
  tag: 'programs-accordion',
  styleUrl: 'programs-accordion.css',
})

export class ProgramsAccordion {
  @Prop() program: any;
  @Prop() color: string;
  @Prop() enrol_button_color: string;
  @Prop() organization_id: string;
  @Prop() organization_name: string;

  @State() active: boolean = false;

  toggleAccordion() {
    this.active = !this.active;
  }

  render() {
    let program_start = moment(this.program.start_date).format('MMM D, YYYY');
    let program_end = moment(this.program.end_date).format('MMM D, YYYY');
    let registration_start = moment(this.program.registration_start_date).format('MMM D, YYYY');
    let registration_end = moment(this.program.registration_end_date).format('MMM D, YYYY');

    const infoLink = () => {
      let host = 'https://app.hoopstir.com/login';
      let organization_id = this.organization_id;
      let organization_name = encodeURIComponent(this.organization_name);
      let program_name = encodeURIComponent(this.program.group_name);
      let program_ages = encodeURIComponent(this.program.ages);

      let formattedLink;

      if (this.program.type === "External League") {
        formattedLink = `${host}?organization_id=${organization_id}&organization_name=${organization_name}&redirectedUser=true&search=${program_name}%2C${program_ages}&extLeague=true`;
      } else {
        formattedLink = `${host}?organization_id=${organization_id}&organization_name=${organization_name}&redirectedUser=true&search=${program_name}%2C${program_ages}`;
      }

      return formattedLink;
    }

    return (
      <div class='accordion'>
        <div class='badger-accordion js-badger-accordion'>
          <div class='badger-accordion__header' onClick={() => this.toggleAccordion() }>
            <button class={`badger-accordion__trigger js-badger-accordion-header ${this.active ? 'show' : ''}`}>
              <div class="badger-accordion__trigger-title">
                <div class='title'>
                  {`${this.program.group_name}`}
                  <div class="row sub-details">
                    {this.program.ages} {this.program.division}
                  </div>
                </div>
                <div class='dates'>
                  {this.program.season}
                </div>
              </div>
              <div class="badger-accordion__trigger-icon">
              </div>
            </button>
          </div>
          <div class={`badger-accordion__panel js-badger-accordion-panel ${this.active ? 'open' : '-ba-is-hidden'}`}>
            <div class="badger-accordion__panel-inner text-module js-badger-accordion-panel-inner">
              <div class="panel-section padding-bottom">
                <span class='label'>Dates:</span> {program_start} - {program_end}
              </div>
              <div class="panel-section padding-bottom">
                <span class='label'>Registration:</span> {registration_start} - {registration_end}
              </div>
              <div class="panel-section details">
                <span class='label'>Details:</span> {this.program.program_description}
              </div>

              <div class='info-button'>
                <a class='rounded-button' href={infoLink()} target="_blank">More Info</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
