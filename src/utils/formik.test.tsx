/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unsafe-call, @typescript-eslint/require-await */
import { act } from '@testing-library/react'
import { FieldProps } from 'formik'
import _ from 'lodash'
import React from 'react'

import { render } from 'src/test-helpers/test-utils'

import { formikFieldTransformer } from './formik'

describe('utils/formik.ts module', () => {
  describe('formikFieldTransformer', () => {
    it('transforms a field', async () => {
      let triggerChange: (event: React.ChangeEvent<string>) => void = () => null
      let innerValue: unknown = null
      function Field(props: FieldProps<string>) {
        triggerChange = (event: React.ChangeEvent<string>) => {
          // @ts-ignore
          props.onChange(event)
        }
        // @ts-ignore
        innerValue = props.value
        return null
      }

      const TransformedField = formikFieldTransformer(
        Field,
        (x) => String(Number(x) * 100),
        (x) => String(Number(x) / 100),
      )

      let outerValue = '0'
      const setFieldValue = jest.fn((_name, value: string) => {
        outerValue = value
      })
      function getFieldProps(outerValue: string) {
        return {
          form: { setFieldValue },
          field: { name: 'name', value: outerValue },
        }
      }

      // @ts-ignore
      const { rerender } = render(<TransformedField {...getFieldProps(outerValue)} />)
      expect(innerValue).toBe('0')

      await act(async () => {
        // @ts-ignore
        triggerChange({ target: { value: '1' } })
      })
      expect(outerValue).toBe('0.01')
      expect(_.last(setFieldValue.mock.calls)).toEqual(['name', '0.01'])

      // @ts-ignore
      rerender(<TransformedField {...getFieldProps(outerValue)} />)
      expect(innerValue).toBe('1')
    })
  })
})
