/* eslint-disable no-irregular-whitespace */
import { render } from '@testing-library/react'
import React from 'react'

import { MockFormik } from '@/helpers/test-utils'

import BasicInfo from './BasicInfo'

test('renders as expected', () => {
  const { container } = render(
    <MockFormik>
      <BasicInfo />
    </MockFormik>,
  )
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
            class="MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth"
          >
            <label
              class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined Mui-required Mui-required"
              data-shrink="true"
            >
              Experiment name
              <span
                aria-hidden="true"
                class="MuiFormLabel-asterisk MuiInputLabel-asterisk"
              >
                 
                *
              </span>
            </label>
            <div
              class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl"
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
                    Experiment name
                     *
                  </span>
                </legend>
              </fieldset>
            </div>
            <p
              class="MuiFormHelperText-root MuiFormHelperText-contained Mui-required"
            >
              Use snake_case.
            </p>
          </div>
        </div>
        <div
          class="makeStyles-row-2"
        >
          <div
            class="MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth"
          >
            <label
              class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined Mui-required Mui-required"
              data-shrink="true"
            >
              Experiment description
              <span
                aria-hidden="true"
                class="MuiFormLabel-asterisk MuiInputLabel-asterisk"
              >
                 
                *
              </span>
            </label>
            <div
              class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-multiline MuiOutlinedInput-multiline"
            >
              <textarea
                aria-invalid="false"
                class="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputMultiline MuiOutlinedInput-inputMultiline"
                name="experiment.description"
                placeholder="Monthly vs. yearly pricing"
                required=""
                rows="4"
              />
              <fieldset
                aria-hidden="true"
                class="PrivateNotchedOutline-root-5 MuiOutlinedInput-notchedOutline"
              >
                <legend
                  class="PrivateNotchedOutline-legendLabelled-7 PrivateNotchedOutline-legendNotched-8"
                >
                  <span>
                    Experiment description
                     *
                  </span>
                </legend>
              </fieldset>
            </div>
            <p
              class="MuiFormHelperText-root MuiFormHelperText-contained Mui-required"
            >
              State your hypothesis.
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
            class="MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth"
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
              class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedStart MuiOutlinedInput-adornedStart"
            >
              <div
                class="MuiInputAdornment-root MuiInputAdornment-positionStart"
              >
                <p
                  class="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary"
                >
                  @
                </p>
              </div>
              <input
                aria-invalid="false"
                class="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedStart MuiOutlinedInput-inputAdornedStart"
                name="experiment.ownerLogin"
                placeholder="scjr"
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
            <p
              class="MuiFormHelperText-root MuiFormHelperText-contained Mui-required"
            >
              Use WordPress.com username.
            </p>
          </div>
        </div>
      </div>
    </div>
  `)
})
