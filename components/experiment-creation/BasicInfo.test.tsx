/* eslint-disable no-irregular-whitespace */
import { render } from '@testing-library/react'
import React from 'react'

import BasicInfo from './BasicInfo'

test('renders as expected', () => {
  const { container } = render(<BasicInfo />)
  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="makeStyles-root-1"
      >
        <h2
          class="MuiTypography-root MuiTypography-h2 MuiTypography-gutterBottom"
        >
          Basic Info
        </h2>
        <div
          class="makeStyles-row-2"
        >
          <div
            class="MuiFormControl-root MuiTextField-root"
          >
            <label
              class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined Mui-required Mui-required"
              data-shrink="true"
            >
              Experiment Name
              <span
                aria-hidden="true"
                class="MuiFormLabel-asterisk MuiInputLabel-asterisk"
              >
                 
                *
              </span>
            </label>
            <div
              class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl"
            >
              <input
                aria-invalid="false"
                class="MuiInputBase-input MuiOutlinedInput-input"
                name="experiment.name"
                placeholder="experiment_name"
                required=""
                type="text"
                value=""
              />
              <fieldset
                aria-hidden="true"
                class="PrivateNotchedOutline-root-5 MuiOutlinedInput-notchedOutline"
              >
                <legend
                  class="PrivateNotchedOutline-legendLabelled-7 PrivateNotchedOutline-legendNotched-8"
                >
                  <span>
                    Experiment Name
                     *
                  </span>
                </legend>
              </fieldset>
            </div>
            <p
              class="MuiFormHelperText-root MuiFormHelperText-contained Mui-required"
            >
              Please use snake_case, all lowercase.
            </p>
          </div>
        </div>
        <div
          class="makeStyles-row-2"
        >
          <div
            class="MuiFormControl-root MuiTextField-root"
          >
            <label
              class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined Mui-required Mui-required"
              data-shrink="true"
            >
              Experiment Description
              <span
                aria-hidden="true"
                class="MuiFormLabel-asterisk MuiInputLabel-asterisk"
              >
                 
                *
              </span>
            </label>
            <div
              class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl MuiInputBase-multiline MuiOutlinedInput-multiline"
            >
              <textarea
                aria-invalid="false"
                class="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputMultiline MuiOutlinedInput-inputMultiline"
                name="experiment.description"
                placeholder="Monthly vs. yearly pricing"
                required=""
                rows="2"
              />
              <fieldset
                aria-hidden="true"
                class="PrivateNotchedOutline-root-5 MuiOutlinedInput-notchedOutline"
              >
                <legend
                  class="PrivateNotchedOutline-legendLabelled-7 PrivateNotchedOutline-legendNotched-8"
                >
                  <span>
                    Experiment Description
                     *
                  </span>
                </legend>
              </fieldset>
            </div>
            <p
              class="MuiFormHelperText-root MuiFormHelperText-contained Mui-required"
            >
              State your hypothesis. It will show up in the list view.
            </p>
          </div>
        </div>
        <div
          class="makeStyles-row-2"
        >
          <div
            class="MuiFormControl-root MuiTextField-root makeStyles-datePicker-4"
          >
            <label
              class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined Mui-required Mui-required"
              data-shrink="true"
            >
              Start date
              <span
                aria-hidden="true"
                class="MuiFormLabel-asterisk MuiInputLabel-asterisk"
              >
                 
                *
              </span>
            </label>
            <div
              class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl"
            >
              <input
                aria-invalid="false"
                class="MuiInputBase-input MuiOutlinedInput-input"
                name="experiment.start_date"
                required=""
                type="date"
                value=""
              />
              <fieldset
                aria-hidden="true"
                class="PrivateNotchedOutline-root-5 MuiOutlinedInput-notchedOutline"
              >
                <legend
                  class="PrivateNotchedOutline-legendLabelled-7 PrivateNotchedOutline-legendNotched-8"
                >
                  <span>
                    Start date
                     *
                  </span>
                </legend>
              </fieldset>
            </div>
          </div>
          <span
            class="makeStyles-through-3"
          >
             through 
          </span>
          <div
            class="MuiFormControl-root MuiTextField-root makeStyles-datePicker-4"
          >
            <label
              class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined Mui-required Mui-required"
              data-shrink="true"
            >
              End date
              <span
                aria-hidden="true"
                class="MuiFormLabel-asterisk MuiInputLabel-asterisk"
              >
                 
                *
              </span>
            </label>
            <div
              class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl"
            >
              <input
                aria-invalid="false"
                class="MuiInputBase-input MuiOutlinedInput-input"
                name="experiment.end_date"
                required=""
                type="date"
                value=""
              />
              <fieldset
                aria-hidden="true"
                class="PrivateNotchedOutline-root-5 MuiOutlinedInput-notchedOutline"
              >
                <legend
                  class="PrivateNotchedOutline-legendLabelled-7 PrivateNotchedOutline-legendNotched-8"
                >
                  <span>
                    End date
                     *
                  </span>
                </legend>
              </fieldset>
            </div>
          </div>
        </div>
        <div
          class="makeStyles-row-2"
        >
          <div
            class="MuiFormControl-root MuiTextField-root"
          >
            <label
              class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined Mui-required Mui-required"
              data-shrink="true"
            >
              Owner
              <span
                aria-hidden="true"
                class="MuiFormLabel-asterisk MuiInputLabel-asterisk"
              >
                 
                *
              </span>
            </label>
            <div
              class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl"
            >
              <input
                aria-invalid="false"
                class="MuiInputBase-input MuiOutlinedInput-input"
                name="experiment.ownerLogin"
                placeholder="@scjr"
                required=""
                type="text"
                value=""
              />
              <fieldset
                aria-hidden="true"
                class="PrivateNotchedOutline-root-5 MuiOutlinedInput-notchedOutline"
              >
                <legend
                  class="PrivateNotchedOutline-legendLabelled-7 PrivateNotchedOutline-legendNotched-8"
                >
                  <span>
                    Owner
                     *
                  </span>
                </legend>
              </fieldset>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  `)
})
