/* eslint-disable no-irregular-whitespace */
import { render } from '@testing-library/react'
import React from 'react'

import Fixtures from '@/helpers/fixtures'
import { createNewExperiment } from '@/lib/experiments'

import ExperimentForm from './ExperimentForm'

test('renders as expected', () => {
  const { container } = render(
    <ExperimentForm
      metrics={Fixtures.createMetricBares(20)}
      segments={Fixtures.createSegments(20)}
      initialExperiment={createNewExperiment()}
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
          <div
            class="MuiPaper-root makeStyles-formPart-2 MuiPaper-elevation1 MuiPaper-rounded"
          >
            <div
              class="makeStyles-root-16"
            >
              <h2
                class="MuiTypography-root MuiTypography-h2 MuiTypography-gutterBottom"
              >
                Audience
              </h2>
              <div
                class="makeStyles-row-17"
              >
                <fieldset
                  class="MuiFormControl-root"
                >
                  <label
                    class="MuiFormLabel-root MuiFormLabel-filled Mui-required"
                  >
                    Platform
                    <span
                      aria-hidden="true"
                      class="MuiFormLabel-asterisk"
                    >
                       
                      *
                    </span>
                  </label>
                  <div
                    class="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl"
                  >
                    <div
                      aria-haspopup="listbox"
                      aria-labelledby="mui-component-select-experiment.platform"
                      class="MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiInputBase-input MuiInput-input"
                      id="mui-component-select-experiment.platform"
                      role="button"
                      tabindex="0"
                    >
                      WordPress.com
                    </div>
                    <input
                      name="experiment.platform"
                      type="hidden"
                      value="wpcom"
                    />
                    <svg
                      aria-hidden="true"
                      class="MuiSvgIcon-root MuiSelect-icon"
                      focusable="false"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M7 10l5 5 5-5z"
                      />
                    </svg>
                  </div>
                </fieldset>
              </div>
              <div
                class="makeStyles-row-17"
              >
                <fieldset
                  class="MuiFormControl-root"
                >
                  <label
                    class="MuiFormLabel-root Mui-required"
                  >
                    User types
                    <span
                      aria-hidden="true"
                      class="MuiFormLabel-asterisk"
                    >
                       
                      *
                    </span>
                  </label>
                  <p
                    class="MuiFormHelperText-root"
                  >
                    Types of users to include in experiment
                  </p>
                  <div
                    class="MuiFormGroup-root"
                    inputlabelprops="[object Object]"
                    required=""
                    role="radiogroup"
                  >
                    <label
                      class="MuiFormControlLabel-root"
                    >
                      <span
                        aria-disabled="false"
                        class="MuiButtonBase-root MuiIconButton-root PrivateSwitchBase-root-22 MuiRadio-root MuiRadio-colorSecondary MuiIconButton-colorSecondary"
                      >
                        <span
                          class="MuiIconButton-label"
                        >
                          <input
                            class="PrivateSwitchBase-input-25"
                            name="experiment.existingUsersAllowed"
                            type="radio"
                            value="false"
                          />
                          <div
                            class="PrivateRadioButtonIcon-root-26"
                          >
                            <svg
                              aria-hidden="true"
                              class="MuiSvgIcon-root"
                              focusable="false"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                              />
                            </svg>
                            <svg
                              aria-hidden="true"
                              class="MuiSvgIcon-root PrivateRadioButtonIcon-layer-27"
                              focusable="false"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M8.465 8.465C9.37 7.56 10.62 7 12 7C14.76 7 17 9.24 17 12C17 13.38 16.44 14.63 15.535 15.535C14.63 16.44 13.38 17 12 17C9.24 17 7 14.76 7 12C7 10.62 7.56 9.37 8.465 8.465Z"
                              />
                            </svg>
                          </div>
                        </span>
                        <span
                          class="MuiTouchRipple-root"
                        />
                      </span>
                      <span
                        class="MuiTypography-root MuiFormControlLabel-label MuiTypography-body1"
                      >
                        New users only
                      </span>
                    </label>
                    <label
                      class="MuiFormControlLabel-root"
                    >
                      <span
                        aria-disabled="false"
                        class="MuiButtonBase-root MuiIconButton-root PrivateSwitchBase-root-22 MuiRadio-root MuiRadio-colorSecondary MuiIconButton-colorSecondary"
                      >
                        <span
                          class="MuiIconButton-label"
                        >
                          <input
                            class="PrivateSwitchBase-input-25"
                            name="experiment.existingUsersAllowed"
                            type="radio"
                            value="true"
                          />
                          <div
                            class="PrivateRadioButtonIcon-root-26"
                          >
                            <svg
                              aria-hidden="true"
                              class="MuiSvgIcon-root"
                              focusable="false"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                              />
                            </svg>
                            <svg
                              aria-hidden="true"
                              class="MuiSvgIcon-root PrivateRadioButtonIcon-layer-27"
                              focusable="false"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M8.465 8.465C9.37 7.56 10.62 7 12 7C14.76 7 17 9.24 17 12C17 13.38 16.44 14.63 15.535 15.535C14.63 16.44 13.38 17 12 17C9.24 17 7 14.76 7 12C7 10.62 7.56 9.37 8.465 8.465Z"
                              />
                            </svg>
                          </div>
                        </span>
                        <span
                          class="MuiTouchRipple-root"
                        />
                      </span>
                      <span
                        class="MuiTypography-root MuiFormControlLabel-label MuiTypography-body1"
                      >
                        All users (new + existing)
                      </span>
                    </label>
                  </div>
                </fieldset>
              </div>
              <div
                class="makeStyles-row-17"
              >
                <fieldset
                  class="MuiFormControl-root makeStyles-segmentationFieldSet-19"
                >
                  <label
                    class="MuiFormLabel-root"
                    for="segments-select"
                  >
                    Targeting
                  </label>
                  <p
                    class="MuiFormHelperText-root makeStyles-segmentationHelperText-18"
                  >
                    Who should see this experiment?
                    <br />
                    Add optional filters to include or exclude specific target audience segments.
                  </p>
                  <div
                    aria-label="include-or-exclude-segments"
                    class="MuiFormGroup-root makeStyles-segmentationExclusionState-20"
                    role="radiogroup"
                  >
                    <label
                      class="MuiFormControlLabel-root"
                    >
                      <span
                        aria-disabled="false"
                        class="MuiButtonBase-root MuiIconButton-root PrivateSwitchBase-root-22 MuiRadio-root MuiRadio-colorSecondary PrivateSwitchBase-checked-23 Mui-checked MuiIconButton-colorSecondary"
                      >
                        <span
                          class="MuiIconButton-label"
                        >
                          <input
                            checked=""
                            class="PrivateSwitchBase-input-25"
                            name="non-formik-segment-exclusion-state-include"
                            type="radio"
                            value="include"
                          />
                          <div
                            class="PrivateRadioButtonIcon-root-26 PrivateRadioButtonIcon-checked-28"
                          >
                            <svg
                              aria-hidden="true"
                              class="MuiSvgIcon-root"
                              focusable="false"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                              />
                            </svg>
                            <svg
                              aria-hidden="true"
                              class="MuiSvgIcon-root PrivateRadioButtonIcon-layer-27"
                              focusable="false"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M8.465 8.465C9.37 7.56 10.62 7 12 7C14.76 7 17 9.24 17 12C17 13.38 16.44 14.63 15.535 15.535C14.63 16.44 13.38 17 12 17C9.24 17 7 14.76 7 12C7 10.62 7.56 9.37 8.465 8.465Z"
                              />
                            </svg>
                          </div>
                        </span>
                        <span
                          class="MuiTouchRipple-root"
                        />
                      </span>
                      <span
                        class="MuiTypography-root MuiFormControlLabel-label MuiTypography-body1"
                      >
                        Include
                      </span>
                    </label>
                    <label
                      class="MuiFormControlLabel-root"
                    >
                      <span
                        aria-disabled="false"
                        class="MuiButtonBase-root MuiIconButton-root PrivateSwitchBase-root-22 MuiRadio-root MuiRadio-colorSecondary MuiIconButton-colorSecondary"
                      >
                        <span
                          class="MuiIconButton-label"
                        >
                          <input
                            class="PrivateSwitchBase-input-25"
                            name="non-formik-segment-exclusion-state-exclude"
                            type="radio"
                            value="exclude"
                          />
                          <div
                            class="PrivateRadioButtonIcon-root-26"
                          >
                            <svg
                              aria-hidden="true"
                              class="MuiSvgIcon-root"
                              focusable="false"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                              />
                            </svg>
                            <svg
                              aria-hidden="true"
                              class="MuiSvgIcon-root PrivateRadioButtonIcon-layer-27"
                              focusable="false"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M8.465 8.465C9.37 7.56 10.62 7 12 7C14.76 7 17 9.24 17 12C17 13.38 16.44 14.63 15.535 15.535C14.63 16.44 13.38 17 12 17C9.24 17 7 14.76 7 12C7 10.62 7.56 9.37 8.465 8.465Z"
                              />
                            </svg>
                          </div>
                        </span>
                        <span
                          class="MuiTouchRipple-root"
                        />
                      </span>
                      <span
                        class="MuiTypography-root MuiFormControlLabel-label MuiTypography-body1"
                      >
                        Exclude
                      </span>
                    </label>
                  </div>
                  <div
                    aria-expanded="false"
                    class="MuiAutocomplete-root MuiAutocomplete-fullWidth MuiAutocomplete-hasClearIcon MuiAutocomplete-hasPopupIcon"
                    name="experiment.segmentAssignments"
                    role="combobox"
                    segmentexclusionstate="include"
                  >
                    <div
                      class="MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth"
                    >
                      <div
                        class="MuiInputBase-root MuiOutlinedInput-root MuiAutocomplete-inputRoot MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedEnd MuiOutlinedInput-adornedEnd"
                      >
                        <input
                          aria-autocomplete="list"
                          aria-invalid="false"
                          autocapitalize="none"
                          autocomplete="off"
                          class="MuiInputBase-input MuiOutlinedInput-input MuiAutocomplete-input MuiAutocomplete-inputFocused MuiInputBase-inputAdornedEnd MuiOutlinedInput-inputAdornedEnd"
                          id="segments-select"
                          placeholder="Search and select to customize"
                          spellcheck="false"
                          type="text"
                          value=""
                        />
                        <div
                          class="MuiAutocomplete-endAdornment"
                        >
                          <button
                            aria-label="Clear"
                            class="MuiButtonBase-root MuiIconButton-root MuiAutocomplete-clearIndicator"
                            tabindex="-1"
                            title="Clear"
                            type="button"
                          >
                            <span
                              class="MuiIconButton-label"
                            >
                              <svg
                                aria-hidden="true"
                                class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall"
                                focusable="false"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                                />
                              </svg>
                            </span>
                            <span
                              class="MuiTouchRipple-root"
                            />
                          </button>
                          <button
                            aria-label="Open"
                            class="MuiButtonBase-root MuiIconButton-root MuiAutocomplete-popupIndicator"
                            tabindex="-1"
                            title="Open"
                            type="button"
                          >
                            <span
                              class="MuiIconButton-label"
                            >
                              <svg
                                aria-hidden="true"
                                class="MuiSvgIcon-root"
                                focusable="false"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M7 10l5 5 5-5z"
                                />
                              </svg>
                            </span>
                            <span
                              class="MuiTouchRipple-root"
                            />
                          </button>
                        </div>
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
                </fieldset>
              </div>
              <div
                class="makeStyles-row-17"
              >
                <fieldset
                  class="MuiFormControl-root makeStyles-segmentationFieldSet-19"
                >
                  <label
                    class="MuiFormLabel-root"
                    for="variations-select"
                  >
                    Variations
                  </label>
                  <p
                    class="MuiFormHelperText-root makeStyles-segmentationHelperText-18"
                  >
                    Define the percentages to include in the experiment.
                    <br />
                    Use “control” for the default (fallback) experience.
                  </p>
                  <div
                    class="MuiTableContainer-root"
                  >
                    <table
                      class="MuiTable-root"
                    >
                      <thead
                        class="MuiTableHead-root"
                      >
                        <tr
                          class="MuiTableRow-root MuiTableRow-head"
                        >
                          <th
                            class="MuiTableCell-root MuiTableCell-head"
                            scope="col"
                          >
                             Name 
                          </th>
                          <th
                            class="MuiTableCell-root MuiTableCell-head"
                            scope="col"
                          >
                             Allocated Percentage 
                          </th>
                        </tr>
                      </thead>
                      <tbody
                        class="MuiTableBody-root"
                      >
                        <tr
                          class="MuiTableRow-root"
                        >
                          <td
                            class="MuiTableCell-root MuiTableCell-body"
                          >
                            control
                          </td>
                          <td
                            class="MuiTableCell-root MuiTableCell-body"
                          >
                            <div
                              class="MuiFormControl-root MuiTextField-root makeStyles-variationAllocatedPercentage-21"
                            >
                              <div
                                class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl MuiInputBase-adornedEnd MuiOutlinedInput-adornedEnd MuiInputBase-marginDense MuiOutlinedInput-marginDense"
                              >
                                <input
                                  aria-invalid="false"
                                  class="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd MuiOutlinedInput-inputAdornedEnd MuiInputBase-inputMarginDense MuiOutlinedInput-inputMarginDense"
                                  max="99"
                                  min="1"
                                  name="experiment.variations[0].allocatedPercentage"
                                  required=""
                                  type="number"
                                  value="50"
                                />
                                <div
                                  class="MuiInputAdornment-root MuiInputAdornment-positionEnd MuiInputAdornment-marginDense"
                                >
                                  <p
                                    class="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary"
                                  >
                                    %
                                  </p>
                                </div>
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
                          </td>
                        </tr>
                        <tr
                          class="MuiTableRow-root"
                        >
                          <td
                            class="MuiTableCell-root MuiTableCell-body"
                          >
                            treatment
                          </td>
                          <td
                            class="MuiTableCell-root MuiTableCell-body"
                          >
                            <div
                              class="MuiFormControl-root MuiTextField-root makeStyles-variationAllocatedPercentage-21"
                            >
                              <div
                                class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl MuiInputBase-adornedEnd MuiOutlinedInput-adornedEnd MuiInputBase-marginDense MuiOutlinedInput-marginDense"
                              >
                                <input
                                  aria-invalid="false"
                                  class="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd MuiOutlinedInput-inputAdornedEnd MuiInputBase-inputMarginDense MuiOutlinedInput-inputMarginDense"
                                  max="99"
                                  min="1"
                                  name="experiment.variations[1].allocatedPercentage"
                                  required=""
                                  type="number"
                                  value="50"
                                />
                                <div
                                  class="MuiInputAdornment-root MuiInputAdornment-positionEnd MuiInputAdornment-marginDense"
                                >
                                  <p
                                    class="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary"
                                  >
                                    %
                                  </p>
                                </div>
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
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </fieldset>
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
