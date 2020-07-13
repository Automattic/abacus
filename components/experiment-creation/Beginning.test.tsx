/* eslint-disable no-irregular-whitespace */
import { render } from '@testing-library/react'
import React from 'react'

import { MockFormik } from '@/helpers/test-utils'

import Beginning from './Beginning'

test('renders as expected', () => {
  const { container } = render(
    <MockFormik>
      <Beginning />
    </MockFormik>,
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="makeStyles-root-1"
      >
        <p
          class="MuiTypography-root MuiTypography-body1"
        >
          We think one of the best ways to prevent a failed experiment is by documenting what you hope to learn.
        </p>
        <div
          class="makeStyles-p2Entry-3"
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
            class="MuiFormControl-root MuiTextField-root makeStyles-p2EntryField-4"
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
                class="PrivateNotchedOutline-root-6 MuiOutlinedInput-notchedOutline"
                style="padding-left: 8px;"
              >
                <legend
                  class="PrivateNotchedOutline-legend-7"
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
          class="MuiButtonBase-root MuiButton-root MuiButton-contained makeStyles-beginButton-5 MuiButton-containedPrimary MuiButton-containedSizeLarge MuiButton-sizeLarge"
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
  `)
})
