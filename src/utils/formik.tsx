import { FieldProps } from 'formik'
import React, { useCallback, useState } from 'react'

/**
 * Wraps a formik field component transforming the value in and out.
 * @param inputComponent The component to wrap
 * @param outerToInner
 * @param innerToOuter
 */
export function formikFieldTransformer<Props extends FieldProps<string>>(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  InputComponent: React.ComponentType<Props>,
  outerToInner: (outerValue: string) => string,
  innerToOuter: (innerValue: string) => string,
): React.ElementType {
  return (props: Props) => {
    const {
      form: { setFieldValue },
      field: { name, value: outerValue },
    } = props

    // This smoothes things out and allows decimal points etc
    // (Allowing many-to-one of inner to outer)
    const [lastInnerValue, setLastInnerValue] = useState<string>(outerToInner(outerValue))
    const value = outerValue === innerToOuter(lastInnerValue) ? lastInnerValue : outerToInner(outerValue)

    const onChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setLastInnerValue(event.target.value)
        setFieldValue(name, innerToOuter(event.target.value))
      },
      [setFieldValue, name],
    )

    return <InputComponent {...props} {...{ onChange, value }} />
  }
}
