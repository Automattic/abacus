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
            class="MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded"
          >
            <div
              class="makeStyles-root-2"
            >
              <p
                class="MuiTypography-root MuiTypography-body1"
              >
                We think one of the best ways to prevent a failed experiment is by documenting what you hope to learn.
              </p>
              <div
                class="makeStyles-p2Entry-4"
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
                  class="MuiFormControl-root MuiTextField-root makeStyles-p2EntryField-5"
                >
                  <div
                    class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl"
                  >
                    <input
                      aria-invalid="false"
                      class="MuiInputBase-input MuiOutlinedInput-input"
                      name="p2Url"
                      placeholder="https://your-p2-post-here"
                      type="text"
                      value=""
                    />
                    <fieldset
                      aria-hidden="true"
                      class="PrivateNotchedOutline-root-7 MuiOutlinedInput-notchedOutline"
                      style="padding-left: 8px;"
                    >
                      <legend
                        class="PrivateNotchedOutline-legend-8"
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
                class="MuiButtonBase-root MuiButton-root MuiButton-contained makeStyles-beginButton-6 MuiButton-containedPrimary MuiButton-containedSizeLarge MuiButton-sizeLarge"
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
          <button
            class="MuiButtonBase-root MuiButton-root MuiButton-text"
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
