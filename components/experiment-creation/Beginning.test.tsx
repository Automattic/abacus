/* eslint-disable no-irregular-whitespace */
import { render } from '@testing-library/react'
import React from 'react'

import { MockFormik } from '@/test-helpers/test-utils'

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
          Without a well documented design, an experiment could be invalid and unsafe for making important decisions.
          <br />
          <br />
          <strong>
            Start by looking up our Field Guide, it will instruct you on creating a P2 post.
          </strong>
        </p>
        <div
          class="MuiFormControl-root MuiTextField-root makeStyles-p2EntryField-2"
        >
          <label
            class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined"
            data-shrink="true"
          >
            Your Post's URL
          </label>
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
