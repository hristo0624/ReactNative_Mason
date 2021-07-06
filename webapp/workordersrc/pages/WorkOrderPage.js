import React from 'react'
import PropTypes from 'prop-types'
import { LIGHT_NAVY } from 'constants/colors'
import styled from 'styled-components'

const WorkOrder = styled.div`
  margin: 0 auto;
  padding: 50px 20px 50px;
  background-color: #fff;
  width: 100%;
  min-height: 100vh;
  max-width: 375px;
  box-sizing: border-box;
`

const HeaderText = styled.h2`
  margin-bottom: 15px;
  font-family: CircularStd-Book;
  font-size: 22px;
  line-height: 36px;
  text-align: center;
  color: ${LIGHT_NAVY};
`

const SubHeaderText = styled.h3`
  color: ${LIGHT_NAVY};
  font-family: Tondo-Bold;
  font-size: 19px;
  text-align: center;
  margin-bottom: 49px;
`

const Item = styled.div`
  display: ${props => props.type === 'description' ? 'block' : 'flex'};
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 18px 0 14px;
  border-bottom: solid;
  border-bottom-width: 1px;
  border-color: rgba(0, 0, 0, 0.1);
  font-family: CircularStd-Medium;
`

const ItemLabel = styled.div`
  font-size: 18px;
  color: ${LIGHT_NAVY}
`

const ItemValue = styled.div`
  margin-top: ${props => props.type === 'description' ? '15px' : '0'};
  font-size: 12px;
`

const Actions = styled.div`
  margin: 44px 0 0;
  text-align: center;
`

const DownLoadButton = styled.button`
  font-family: Lato-Bold;
  font-size: 15px;
  text-align: center;
  background-color: #14d2b8;
  width: 270px;
  height: 50px;
  max-width: 100%;
  border-radius: 22px;
  border: none;
  color: white;

  a {
    text-decoration: none;
    color: white;
  }
`

const List = ({ items }) => {
  return (
    <div>
      {
        items.map((item, index) => {
          return (
            <Item key={index} type={item.type}>
              <ItemLabel type={item.type}>{item.label}</ItemLabel>
              <ItemValue type={item.type}>{item.description}</ItemValue>
            </Item>
          )
        })
      }
    </div>
  )
}

const WorkOrderPage = ({ workorder }) => {
  return (
    <WorkOrder>
      <HeaderText>Request to bid from</HeaderText>
      <SubHeaderText>{workorder.companyName}</SubHeaderText>
      <List
        items={
          [{
            label: 'Contractor',
            description: workorder.companyName
          },
          {
            label: 'Job Location',
            description: `${workorder.projectAddress.city}, ${workorder.projectAddress.stateAbbr}`
          },
          {
            label: 'Type of Work',
            description: workorder.label
          },
          {
            label: 'Project Manager',
            description: workorder.projectManager
          },
          {
            label: 'Description of Work',
            description: workorder.desc,
            type: 'description'
          }]
        }
      />
      <Actions>
        <DownLoadButton><a href='https://google.com'>Download app to bid</a></DownLoadButton>
      </Actions>
    </WorkOrder>
  )
}

WorkOrderPage.propTypes = {
  proposal: PropTypes.object,
  onAgree: PropTypes.func
}

export default WorkOrderPage
