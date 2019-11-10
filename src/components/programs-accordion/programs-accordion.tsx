import { Component, Prop, State, h } from '@stencil/core';
import {css} from 'emotion';

@Component({
  tag: 'programs-accordion',
  styleUrl: 'programs-accordion.css',
})

export class ProgramsAccordion {
  @Prop() program: any;
  @Prop() color: string;

  @State() active: boolean = false;

  toggleAccordion() {
    this.active = !this.active;
  }

  render() {
    // let start = moment(this.program.start_date).format('MMM D, YYYY');
    // let end = moment(this.program.end_date).format('MMM D, YYYY');

    const triggerStyle = css`
      &:hover {
        background-color: ${this.color} !important;
      }
    `

    return (
      <div class='accordion'>
        <div class='badger-accordion js-badger-accordion'>
          <div class='badger-accordion__header' onClick={() => this.toggleAccordion() }>
            <button class={`badger-accordion__trigger js-badger-accordion-header ${triggerStyle} ${this.active ? 'show' : ''}`}>
              <div class="badger-accordion__trigger-title">
                <div class='title'>
                  {`${this.program.group_name} (${this.program.ages} ${this.program.division})`}
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
              <span class='label'>Description:</span> {this.program.program_description}

              <div class='info-button'>
                <a class='rounded-button' href="http://app.hoopstir.com" target="_blank">More Info</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
