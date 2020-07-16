/* eslint-disable no-irregular-whitespace */
import { render } from '@testing-library/react'
import React from 'react'

import Fixtures from '@/helpers/fixtures'

import ExperimentForm from './ExperimentForm'

test('renders as expected', () => {
  const { container } = render(
    <ExperimentForm
      metrics={Fixtures.createMetricBares(20)}
      segments={Fixtures.createSegments(20)}
      initialExperiment={{}}
    />,
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="makeStyles-root-1"
      >
        <form>
          <div
            class="MuiPaper-root makeStyles-formPart-2 MuiPaper-elevation1 MuiPaper-rounded"
          >
            <div
              class="makeStyles-root-3"
            >
              <p
                class="MuiTypography-root MuiTypography-body1"
              >
                We think one of the best ways to prevent a failed experiment is by documenting what you hope to learn.
              </p>
              <div
                class="makeStyles-p2Entry-5"
              >
                <h6
                  class="MuiTypography-root MuiTypography-h6 MuiTypography-gutterBottom"
                >
                  P2 Link
                </h6>
                <p
                  class="MuiTypography-root MuiTypography-body1 MuiTypography-gutterBottom"
                >
                  Once you've designed and documented your experiment, enter the P2 post URL:
                </p>
                <div
                  class="MuiFormControl-root MuiTextField-root makeStyles-p2EntryField-6"
                >
                  <div
                    class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl"
                  >
                    <input
                      aria-invalid="false"
                      class="MuiInputBase-input MuiOutlinedInput-input"
                      name="experiment.p2Url"
                      placeholder="https://your-p2-post-here"
                      type="text"
                      value=""
                    />
                    <fieldset
                      aria-hidden="true"
                      class="PrivateNotchedOutline-root-8 MuiOutlinedInput-notchedOutline"
                      style="padding-left: 8px;"
                    >
                      <legend
                        class="PrivateNotchedOutline-legend-9"
                        style="width: 0.01px;"
                      >
                        <span>
                          ​
                        </span>
                      </legend>
                    </fieldset>
                  </div>
                </div>
              </div>
              <button
                class="MuiButtonBase-root MuiButton-root MuiButton-contained makeStyles-beginButton-7 MuiButton-containedPrimary MuiButton-containedSizeLarge MuiButton-sizeLarge"
                tabindex="0"
                type="button"
              >
                <span
                  class="MuiButton-label"
                >
                  Begin
                </span>
                <span
                  class="MuiTouchRipple-root"
                />
              </button>
            </div>
          </div>
          <div
            class="MuiPaper-root makeStyles-formPart-2 MuiPaper-elevation1 MuiPaper-rounded"
          >
            <div
              class="makeStyles-root-12"
            >
              <h2
                class="MuiTypography-root MuiTypography-h2 MuiTypography-gutterBottom"
              >
                Basic Info
              </h2>
              <div
                class="makeStyles-row-13"
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
                      class="PrivateNotchedOutline-root-8 MuiOutlinedInput-notchedOutline"
                    >
                      <legend
                        class="PrivateNotchedOutline-legendLabelled-10 PrivateNotchedOutline-legendNotched-11"
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
                class="makeStyles-row-13"
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
                      class="PrivateNotchedOutline-root-8 MuiOutlinedInput-notchedOutline"
                    >
                      <legend
                        class="PrivateNotchedOutline-legendLabelled-10 PrivateNotchedOutline-legendNotched-11"
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
                class="makeStyles-row-13"
              >
                <div
                  class="MuiFormControl-root MuiTextField-root makeStyles-datePicker-15"
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
                      class="PrivateNotchedOutline-root-8 MuiOutlinedInput-notchedOutline"
                    >
                      <legend
                        class="PrivateNotchedOutline-legendLabelled-10 PrivateNotchedOutline-legendNotched-11"
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
                  class="makeStyles-through-14"
                >
                   through 
                </span>
                <div
                  class="MuiFormControl-root MuiTextField-root makeStyles-datePicker-15"
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
                      class="PrivateNotchedOutline-root-8 MuiOutlinedInput-notchedOutline"
                    >
                      <legend
                        class="PrivateNotchedOutline-legendLabelled-10 PrivateNotchedOutline-legendNotched-11"
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
                class="makeStyles-row-13"
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
                      class="PrivateNotchedOutline-root-8 MuiOutlinedInput-notchedOutline"
                    >
                      <legend
                        class="PrivateNotchedOutline-legendLabelled-10 PrivateNotchedOutline-legendNotched-11"
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
          <button
            class="MuiButtonBase-root MuiButton-root MuiButton-contained"
            tabindex="0"
            type="submit"
          >
            <span
              class="MuiButton-label"
            >
              Submit
            </span>
            <span
              class="MuiTouchRipple-root"
            />
          </button>
        </form>
      </div>
    </div>
  `)
})

test.todo('form works as expected')
