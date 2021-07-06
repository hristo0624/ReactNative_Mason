import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import styled from 'styled-components'
import moment from 'moment-timezone'

import Card from 'shared/components/Card'
import Marketing from 'shared/icons/Marketing'
import { getWidth, getHeight } from 'shared/utils/dynamicSize'
import { StyledText } from 'shared/components/StyledComponents'

import ManWithCash from 'icons/ManWithCash'
import { BATTLESHIP_GREY, BLUEY_GREY, LIGHT_NAVY } from 'shared/constants/colors'

const ImageWrapper = styled.View`
  position: absolute;
  right: 0;
  bottom: 0;
`
const Header = styled.View`
  flex-direction: row;
  align-items: center;
`
const Content = styled.View`
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  margin-top: ${props => getHeight(14, props.viewport)};
  padding-right: ${props => getWidth(80, props.viewport)};
`

class JobRequest extends Component {
  render () {
    const { viewport, client, desc, date } = this.props
    const title = 'New job request'
    return (
      <Card width={252} height={140}>
        <Header>
          <Marketing size={getWidth(20, viewport)} />
          <StyledText
            fontSize={11}
            color={LIGHT_NAVY}
            letterSpacing={1}
            customStyle={`margin-left: ${getWidth(12, viewport)}`}
            medium
          >
            {_.toUpper(title)}
          </StyledText>
        </Header>
        <Content viewport={viewport}>
          <StyledText
            fontSize={13}
            color={BATTLESHIP_GREY}
            letterSpacing={0.58}
            >
              {client}
            </StyledText>
            <StyledText
            fontSize={12}
            color={BLUEY_GREY}
            letterSpacing={0.53}
            // customStyle={`margin-vertical: ${getHeight(7, viewport)}`}
            >
              {desc}
            </StyledText>
            <StyledText
            fontSize={9}
            color={BLUEY_GREY}
            letterSpacing={0.4}
            >
              {`Starts ${moment(date).fromNow()}`}
            </StyledText>
        </Content>
        <ImageWrapper>
          <ManWithCash
            width={getWidth(80, viewport)}
            height={getWidth(58, viewport)}
          />
        </ImageWrapper>
      </Card>
    )
  }
}

JobRequest.defaultProps = {
  client: 'Rancho Cucamonga',
  desc: '375 square feet of new wood flooring',
  date: moment().add(3, 'days')
}
export default connect(state => ({ viewport: state.viewport }))(JobRequest)
