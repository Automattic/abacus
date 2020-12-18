/* eslint-disable no-irregular-whitespace */
import { render } from '@testing-library/react'
import React from 'react'

import { MockFormik } from 'src/test-helpers/test-utils'

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
        <h4
          class="MuiTypography-root MuiTypography-h4 MuiTypography-gutterBottom"
        >
          Design and Document Your Experiment
        </h4>
        <p
          class="MuiTypography-root MuiTypography-body2"
        >
          We think one of the best ways to prevent a failed experiment is by documenting what you hope to learn.
          <br />
          <br />
        </p>
        <div
          class="MuiPaper-root MuiAlert-root MuiAlert-standardInfo MuiPaper-elevation0"
          role="alert"
        >
          <div
            class="MuiAlert-icon"
          >
            <svg
              aria-hidden="true"
              class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit"
              focusable="false"
              viewBox="0 0 24 24"
            >
              <path
                d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z"
              />
            </svg>
          </div>
          <div
            class="MuiAlert-message"
          >
            <a
              class="MuiTypography-root MuiLink-root MuiLink-underlineAlways MuiTypography-colorPrimary"
              href="https://github.com/Automattic/experimentation-platform/wiki"
              target="_blank"
            >
              Our wiki is a great place to start
            </a>
            , it will instruct you on creating a P2 post.
          </div>
        </div>
        <div
          class="MuiFormControl-root MuiTextField-root makeStyles-p2EntryField-2"
        >
          <label
            class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined"
            data-shrink="true"
            for="experiment.p2Url"
            id="experiment.p2Url-label"
          >
            Your Post's URL
          </label>
          <div
            class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl"
          >
            <input
              aria-invalid="false"
              class="MuiInputBase-input MuiOutlinedInput-input"
              id="experiment.p2Url"
              name="experiment.p2Url"
              placeholder="https://your-p2-post-here"
              type="text"
              value=""
            />
            <fieldset
              aria-hidden="true"
              class="PrivateNotchedOutline-root-4 MuiOutlinedInput-notchedOutline"
            >
              <legend
                class="PrivateNotchedOutline-legendLabelled-6 PrivateNotchedOutline-legendNotched-7"
              >
                <span>
                  Your Post's URL
                </span>
              </legend>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  `)
})
