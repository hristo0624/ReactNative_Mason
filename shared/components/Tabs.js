import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity } from 'react-native'
import styled from 'styled-components'


const Container = styled(View)`
  flex-direction: row;
  width: 100%;
  height: ${props => props.height};
  ${props => props.customStyle || ''};
  /* background-color: #F9F9F9; */
`
const ItemContentContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  height: ${props => props.height - 2};
  justify-content: center;
`
const ItemContainer = styled(TouchableOpacity)`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
`
const Indicator = styled(View)`
  height: 2;
  width: 60%;
  /* margin-top: 5%; */
  background-color: ${props => props.isSelected ? props.indicatorColor : 'transparent'};
`
const Delimiter = styled(View)`
  height: ${props => props.height * 0.7};
  width: 1;
  margin-top: ${props => props.height * 0.15};
  background-color: rgba(0, 0, 0, 0.1);
`

const Tabs = (props) => {
  const { items, selectedId, onSelect, indicatorColor, containerCustomStyle, height } = props
  return (
    <Container
      customStyle={containerCustomStyle}
      height={height}
    >
      {items.map((item, i) => {
        const isSelected = item.id === selectedId
        return (
          <React.Fragment key={item.id}>
            { i > 0
              ? <Delimiter
                key={`${item.id}_delim`}
                height={height}
              />
              : null }
            <ItemContainer
              key={item.id}
              activeOpacity={0.75}
              onPress={() => onSelect(item.id)}
            >
              <ItemContentContainer height={height}>
                {item.label}
              </ItemContentContainer>
              <Indicator
                isSelected={isSelected}
                indicatorColor={indicatorColor}
              />
            </ItemContainer>
          </React.Fragment>
        )
      })}
    </Container>
  )
}

Tabs.defaultProps = {
  indicatorColor: 'blue'
}

Tabs.propTypes = {
  items: PropTypes.array,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func,
  indicatorColor: PropTypes.string,
  containerCustomStyle: PropTypes.string,
  height: PropTypes.number.isRequired
}

export default Tabs