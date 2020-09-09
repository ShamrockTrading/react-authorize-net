import * as R from 'ramda'
import React from 'react'
import {
  FaCreditCard,
  FaExclamationCircle,
  FaRegCalendarAlt,
  FaEyeSlash
} from 'react-icons/fa'
import { Motion, spring } from 'react-motion'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components'
import { FormType, InjectedProps } from './FormContainer'
import Input, { Props } from './Input'

const FormInput = styled(Input)(props => ({
  '& input': {
    '&::placeholder': { color: 'inherit' },
    '&:focus': { outline: 0 },
    backgroundColor: 'transparent',
    border: '0',
    padding: '0'
  },
  backgroundColor: '#fff',
  borderBottom: '1px solid #989898',
  color: props.valid ? '#000' : '#a8a8a8',
  fontFamily: 'inherit',
  fontSize: '14px',
  height: '1em',
  padding: '1.5em',
  width: '100%'
}))

const PayButton = styled.button(props => ({
  '&:hover': {
    cursor: !props.disabled ? 'pointer' : 'not-allowed'
  },
  backgroundColor: '#0083ca',
  borderRadius: '4px',
  color: 'white',
  fontSize: '0.875rem',
  opacity: props.disabled ? 0.9 : 1,
  fontFamily: 'inherit',
  textTransform: 'uppercase',
  padding: '5px 15px',
  float: 'right'
}))

const CancelButton = styled.button(props => ({
  '&:hover': {
    cursor: !props.disabled ? 'pointer' : 'not-allowed'
  },
  backgroundColor: 'white',
  borderRadius: '4px',
  border: '1px solid #0083ca',
  color: '#0083ca',
  fontSize: '0.875rem',
  opacity: props.disabled ? 0.9 : 1,
  fontFamily: 'inherit',
  textTransform: 'uppercase',
  padding: '5px 15px'
}))

const CardNumber = ({
  type = 'text',
  name = 'cardNumber',
  placeholder = 'CARD NUMBER',
  ...props
}: Props) => {
  return (
    <FormInput
      name="cardNumber"
      type={type}
      placeholder={placeholder}
      guide={false}
      label={<FaCreditCard size="1.1em" />}
      mask={[
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/
      ]}
      {...props}
    />
  )
}

const CardCode = ({
  type = 'text',
  name = 'cardCode',
  placeholder = 'CVC',
  ...props
}: Props) => {
  return (
    <FormInput
      name={name}
      type={type}
      placeholder={placeholder}
      guide={false}
      mask={[/\d/, /\d/, /\d/, /\d?/]}
      {...props}
    />
  )
}

const ExpDate = ({
  type = 'text',
  name = 'expDate',
  placeholder = 'MM/YY',
  ...props
}: Props) => {
  return (
    <FormInput
      name={name}
      type={type}
      placeholder={placeholder}
      mask={[/\d/, /\d/, '/', /\d/, /\d/]}
      guide={false}
      label={<FaRegCalendarAlt size="1.1em" />}
      {...props}
    />
  )
}

const DisclaimerContainer = styled.div`
  text-align: center;
  color: #bababa
  margin-top: 20px;
`

const Disclaimer = (props: {
  disclaimer?: string
  style?: React.CSSProperties
}) => {
  return (
    <DisclaimerContainer style={props.style}>
      {props.disclaimer}
    </DisclaimerContainer>
  )
}

const CardEye = styled(FaEyeSlash)(props => ({
  color: !props.values ? '#a8a8a8' : '#a8a8a8',
  position: 'absolute',
  right: '74px',
  top: '74px'
}))

const toggleValue = () => {
  console.log('toggle')
}

const ErrorComponent = (props: {
  field: keyof FormType
  style?: React.CSSProperties
  key?: string
}) => {
  const slugs: { [K in keyof FormType]: string } = {
    cardCode: 'Card code',
    cardNumber: 'Card number',
    expDate: 'Expiration date'
  }

  return (
    <Flex
      style={props.style}
      key={props.field}
      justifyContent="center"
      alignItems="center"
    >
      <FaExclamationCircle color="inherit" />
      <Text fontFamily="inherit" color="inherit" pl={2}>
        {slugs[props.field]} is not valid
      </Text>
    </Flex>
  )
}

type FormComponentProps = InjectedProps & {
  className?: string
  style?: {
    form?: React.CSSProperties
    button?: React.CSSProperties
    input?: React.CSSProperties
  }
}

const FormComponent: React.FC<FormComponentProps> = ({ style, ...props }) => {
  const canSubmit = R.values(props.validationErrors).every(
    value => value === true
  )

  const invalidFields: Array<keyof FormType> = R.toPairs(props.validationErrors)
    .filter(([, status]) => !status)
    .map(([v]) => v as keyof FormType)
    .slice(0, 1)

  return (
    <Flex
      className={props.className}
      style={style && style.form}
      flexWrap="wrap"
      mb={4}
      bg="#fff"
      p={[3, 5] as any}
      justifyContent="center"
    >
      <Box width={[1, 1]} mb={[3, 0] as any}>
        <CardEye onClick={toggleValue} />
        <CardNumber
          style={style && style.input}
          onFocus={R.curry(props.handleFocus)('cardNumber')}
          onBlur={props.handleBlur}
          onChange={R.curry(props.handleChange)('cardNumber')}
          focused={props.focused === 'cardNumber'}
          valid={props.validationErrors.cardNumber}
          value={props.values.cardNumber}
        />
      </Box>

      <Box width={[1 / 2, 1 / 2]} pl={0}>
        <ExpDate
          style={style && style.input}
          onFocus={R.curry(props.handleFocus)('expDate')}
          onBlur={props.handleBlur}
          onChange={R.curry(props.handleChange)('expDate')}
          valid={props.validationErrors.expDate}
          focused={props.focused === 'expDate'}
          value={props.values.expDate}
        />
      </Box>

      <Box width={[1 / 2, 1 / 2]} pl={[0, 4] as any}>
        <CardCode
          style={style && style.input}
          onFocus={R.curry(props.handleFocus)('cardCode')}
          onBlur={props.handleBlur}
          onChange={R.curry(props.handleChange)('cardCode')}
          focused={props.focused === 'cardCode'}
          valid={props.validationErrors.cardCode}
          value={props.values.cardCode}
        />
      </Box>

      <Box width={[1, 1]} pl={[0, 0] as any}>
        <Disclaimer />
      </Box>

      <Box width={1} py={4}>
        <Motion
          key={R.head(invalidFields)}
          style={{ opacity: spring(1) }}
          defaultStyle={{ opacity: 0 }}
        >
          {config => (
            <div style={config}>
              {R.head(invalidFields) ? (
                <ErrorComponent
                  key={R.head(invalidFields)}
                  field={R.head(invalidFields) as keyof FormType}
                />
              ) : null}
            </div>
          )}
        </Motion>
      </Box>

      <Box width={[1 / 2, 1 / 2] as any} pt={4}>
        <CancelButton
          style={style && style.button}
          onClick={props.handleCancel}
        >
          Cancel
        </CancelButton>
      </Box>

      <Box width={[1 / 2, 1 / 2] as any} pt={4}>
        <PayButton
          style={style && style.button}
          disabled={!canSubmit}
          onClick={canSubmit ? props.handleSubmit : undefined}
        >
          Pay ${props.amount}
        </PayButton>
      </Box>
    </Flex>
  )
}

export default FormComponent
