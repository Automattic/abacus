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
        <div
          class="makeStyles-navigation-2"
        >
          <div
            class="MuiPaper-root MuiStepper-root MuiStepper-vertical MuiPaper-elevation0"
          >
            <div
              class="MuiStep-root MuiStep-vertical"
            >
              <button
                class="MuiButtonBase-root MuiStepButton-root MuiStepButton-vertical"
                tabindex="0"
                type="button"
              >
                <span
                  class="MuiStepLabel-root MuiStepLabel-vertical"
                >
                  <span
                    class="MuiStepLabel-iconContainer"
                  >
                    <svg
                      aria-hidden="true"
                      class="MuiSvgIcon-root MuiStepIcon-root MuiStepIcon-active"
                      focusable="false"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="12"
                      />
                      <text
                        class="MuiStepIcon-text"
                        text-anchor="middle"
                        x="12"
                        y="16"
                      >
                        1
                      </text>
                    </svg>
                  </span>
                  <span
                    class="MuiStepLabel-labelContainer"
                  >
                    <span
                      class="MuiTypography-root MuiStepLabel-label MuiStepLabel-active MuiTypography-body2 MuiTypography-displayBlock"
                    >
                      Start
                    </span>
                  </span>
                </span>
                <span
                  class="MuiTouchRipple-root MuiStepButton-touchRipple"
                />
              </button>
            </div>
            <div
              class="MuiStepConnector-root MuiStepConnector-vertical"
            >
              <span
                class="MuiStepConnector-line MuiStepConnector-lineVertical"
              />
            </div>
            <div
              class="MuiStep-root MuiStep-vertical"
            >
              <button
                class="MuiButtonBase-root MuiStepButton-root MuiStepButton-vertical"
                tabindex="0"
                type="button"
              >
                <span
                  class="MuiStepLabel-root MuiStepLabel-vertical"
                >
                  <span
                    class="MuiStepLabel-iconContainer"
                  >
                    <svg
                      aria-hidden="true"
                      class="MuiSvgIcon-root MuiStepIcon-root"
                      focusable="false"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="12"
                      />
                      <text
                        class="MuiStepIcon-text"
                        text-anchor="middle"
                        x="12"
                        y="16"
                      >
                        2
                      </text>
                    </svg>
                  </span>
                  <span
                    class="MuiStepLabel-labelContainer"
                  >
                    <span
                      class="MuiTypography-root MuiStepLabel-label MuiTypography-body2 MuiTypography-displayBlock"
                    >
                      Basic Info
                    </span>
                  </span>
                </span>
                <span
                  class="MuiTouchRipple-root MuiStepButton-touchRipple"
                />
              </button>
            </div>
            <div
              class="MuiStepConnector-root MuiStepConnector-vertical"
            >
              <span
                class="MuiStepConnector-line MuiStepConnector-lineVertical"
              />
            </div>
            <div
              class="MuiStep-root MuiStep-vertical"
            >
              <button
                class="MuiButtonBase-root MuiStepButton-root MuiStepButton-vertical"
                tabindex="0"
                type="button"
              >
                <span
                  class="MuiStepLabel-root MuiStepLabel-vertical"
                >
                  <span
                    class="MuiStepLabel-iconContainer"
                  >
                    <svg
                      aria-hidden="true"
                      class="MuiSvgIcon-root MuiStepIcon-root"
                      focusable="false"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="12"
                      />
                      <text
                        class="MuiStepIcon-text"
                        text-anchor="middle"
                        x="12"
                        y="16"
                      >
                        3
                      </text>
                    </svg>
                  </span>
                  <span
                    class="MuiStepLabel-labelContainer"
                  >
                    <span
                      class="MuiTypography-root MuiStepLabel-label MuiTypography-body2 MuiTypography-displayBlock"
                    >
                      Audience
                    </span>
                  </span>
                </span>
                <span
                  class="MuiTouchRipple-root MuiStepButton-touchRipple"
                />
              </button>
            </div>
            <div
              class="MuiStepConnector-root MuiStepConnector-vertical"
            >
              <span
                class="MuiStepConnector-line MuiStepConnector-lineVertical"
              />
            </div>
            <div
              class="MuiStep-root MuiStep-vertical"
            >
              <button
                class="MuiButtonBase-root MuiStepButton-root MuiStepButton-vertical"
                tabindex="0"
                type="button"
              >
                <span
                  class="MuiStepLabel-root MuiStepLabel-vertical"
                >
                  <span
                    class="MuiStepLabel-iconContainer"
                  >
                    <svg
                      aria-hidden="true"
                      class="MuiSvgIcon-root MuiStepIcon-root"
                      focusable="false"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="12"
                      />
                      <text
                        class="MuiStepIcon-text"
                        text-anchor="middle"
                        x="12"
                        y="16"
                      >
                        4
                      </text>
                    </svg>
                  </span>
                  <span
                    class="MuiStepLabel-labelContainer"
                  >
                    <span
                      class="MuiTypography-root MuiStepLabel-label MuiTypography-body2 MuiTypography-displayBlock"
                    >
                      Metrics
                    </span>
                  </span>
                </span>
                <span
                  class="MuiTouchRipple-root MuiStepButton-touchRipple"
                />
              </button>
            </div>
            <div
              class="MuiStepConnector-root MuiStepConnector-vertical"
            >
              <span
                class="MuiStepConnector-line MuiStepConnector-lineVertical"
              />
            </div>
            <div
              class="MuiStep-root MuiStep-vertical"
            >
              <button
                class="MuiButtonBase-root MuiStepButton-root MuiStepButton-vertical"
                tabindex="0"
                type="button"
              >
                <span
                  class="MuiStepLabel-root MuiStepLabel-vertical"
                >
                  <span
                    class="MuiStepLabel-iconContainer"
                  >
                    <svg
                      aria-hidden="true"
                      class="MuiSvgIcon-root MuiStepIcon-root"
                      focusable="false"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="12"
                      />
                      <text
                        class="MuiStepIcon-text"
                        text-anchor="middle"
                        x="12"
                        y="16"
                      >
                        5
                      </text>
                    </svg>
                  </span>
                  <span
                    class="MuiStepLabel-labelContainer"
                  >
                    <span
                      class="MuiTypography-root MuiStepLabel-label MuiTypography-body2 MuiTypography-displayBlock"
                    >
                      Submit
                    </span>
                  </span>
                </span>
                <span
                  class="MuiTouchRipple-root MuiStepButton-touchRipple"
                />
              </button>
            </div>
          </div>
        </div>
        <div
          class="makeStyles-form-3"
        >
          <form>
            <div
              class="makeStyles-formPart-4"
            >
              <div
                class="makeStyles-root-7"
              >
                <p
                  class="MuiTypography-root MuiTypography-body1"
                >
                  We think one of the best ways to prevent a failed experiment is by documenting what you hope to learn.
                </p>
                <div
                  class="makeStyles-p2Entry-9"
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
                    class="MuiFormControl-root MuiTextField-root makeStyles-p2EntryField-10"
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
                        class="PrivateNotchedOutline-root-12 MuiOutlinedInput-notchedOutline"
                        style="padding-left: 8px;"
                      >
                        <legend
                          class="PrivateNotchedOutline-legend-13"
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
              </div>
              <div
                class="makeStyles-formPartActions-5"
              >
                <button
                  class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"
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
              class="makeStyles-formPart-4"
            >
              <div
                class="MuiPaper-root makeStyles-paper-6 MuiPaper-elevation1 MuiPaper-rounded"
              >
                <div
                  class="makeStyles-root-16"
                >
                  <h2
                    class="MuiTypography-root MuiTypography-h2 MuiTypography-gutterBottom"
                  >
                    Basic Info
                  </h2>
                  <div
                    class="makeStyles-row-17"
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
                          class="PrivateNotchedOutline-root-12 MuiOutlinedInput-notchedOutline"
                        >
                          <legend
                            class="PrivateNotchedOutline-legendLabelled-14 PrivateNotchedOutline-legendNotched-15"
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
                    class="makeStyles-row-17"
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
                          class="PrivateNotchedOutline-root-12 MuiOutlinedInput-notchedOutline"
                        >
                          <legend
                            class="PrivateNotchedOutline-legendLabelled-14 PrivateNotchedOutline-legendNotched-15"
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
                    class="makeStyles-row-17"
                  >
                    <div
                      class="MuiFormControl-root MuiTextField-root makeStyles-datePicker-19"
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
                          class="PrivateNotchedOutline-root-12 MuiOutlinedInput-notchedOutline"
                        >
                          <legend
                            class="PrivateNotchedOutline-legendLabelled-14 PrivateNotchedOutline-legendNotched-15"
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
                      class="makeStyles-through-18"
                    >
                       through 
                    </span>
                    <div
                      class="MuiFormControl-root MuiTextField-root makeStyles-datePicker-19"
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
                          class="PrivateNotchedOutline-root-12 MuiOutlinedInput-notchedOutline"
                        >
                          <legend
                            class="PrivateNotchedOutline-legendLabelled-14 PrivateNotchedOutline-legendNotched-15"
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
                    class="makeStyles-row-17"
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
                          class="PrivateNotchedOutline-root-12 MuiOutlinedInput-notchedOutline"
                        >
                          <legend
                            class="PrivateNotchedOutline-legendLabelled-14 PrivateNotchedOutline-legendNotched-15"
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
              <div
                class="makeStyles-formPartActions-5"
              >
                <button
                  class="MuiButtonBase-root MuiButton-root MuiButton-text"
                  tabindex="0"
                  type="button"
                >
                  <span
                    class="MuiButton-label"
                  >
                    Previous
                  </span>
                  <span
                    class="MuiTouchRipple-root"
                  />
                </button>
                <button
                  class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"
                  tabindex="0"
                  type="button"
                >
                  <span
                    class="MuiButton-label"
                  >
                    Next
                  </span>
                  <span
                    class="MuiTouchRipple-root"
                  />
                </button>
              </div>
            </div>
            <div
              class="makeStyles-formPart-4"
            >
              <div
                class="MuiPaper-root makeStyles-paper-6 MuiPaper-elevation1 MuiPaper-rounded"
              >
                <p
                  class="MuiTypography-root MuiTypography-body1"
                >
                  Audience Form Part
                </p>
              </div>
              <div
                class="makeStyles-formPartActions-5"
              >
                <button
                  class="MuiButtonBase-root MuiButton-root MuiButton-text"
                  tabindex="0"
                  type="button"
                >
                  <span
                    class="MuiButton-label"
                  >
                    Previous
                  </span>
                  <span
                    class="MuiTouchRipple-root"
                  />
                </button>
                <button
                  class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"
                  tabindex="0"
                  type="button"
                >
                  <span
                    class="MuiButton-label"
                  >
                    Next
                  </span>
                  <span
                    class="MuiTouchRipple-root"
                  />
                </button>
              </div>
            </div>
            <div
              class="makeStyles-formPart-4"
            >
              <div
                class="MuiPaper-root makeStyles-paper-6 MuiPaper-elevation1 MuiPaper-rounded"
              >
                <p
                  class="MuiTypography-root MuiTypography-body1"
                >
                  Metrics Form Part
                </p>
              </div>
              <div
                class="makeStyles-formPartActions-5"
              >
                <button
                  class="MuiButtonBase-root MuiButton-root MuiButton-text"
                  tabindex="0"
                  type="button"
                >
                  <span
                    class="MuiButton-label"
                  >
                    Previous
                  </span>
                  <span
                    class="MuiTouchRipple-root"
                  />
                </button>
                <button
                  class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"
                  tabindex="0"
                  type="button"
                >
                  <span
                    class="MuiButton-label"
                  >
                    Next
                  </span>
                  <span
                    class="MuiTouchRipple-root"
                  />
                </button>
              </div>
            </div>
            <div
              class="makeStyles-formPart-4"
            >
              <div
                class="MuiPaper-root makeStyles-paper-6 MuiPaper-elevation1 MuiPaper-rounded"
              >
                <p
                  class="MuiTypography-root MuiTypography-body1 MuiTypography-gutterBottom"
                >
                  This last form-part gives the users a chance to pause and consider.
                  <br />
                  <br />
                  It is good to have a mini-checklist here.
                  <br />
                  <br />
                  Maybe a pre-submission summary.
                  <br />
                  <br />
                  It is also good for the users to know the consequences of submitting so they aren't afraid of pressing the button.
                </p>
              </div>
              <div
                class="makeStyles-formPartActions-5"
              >
                <button
                  class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedSecondary"
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `)
})

test.todo('form works as expected')
