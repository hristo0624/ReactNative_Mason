import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Layout, Card, Select, Stack, Button, ResourceList } from '@shopify/polaris'

class ProposalAgreements extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // selectOptions: this.makeSelectOptions(props)
    }
  }

  static getDerivedStateFromProps (props, state) {
    if (props.agreementsDict !== state.prevAgreementsDict || props.agreements !== state.prevAgreements) {
      const options = []
      console.log('make select options, dict', props.agreementsDict)
      let defaultSelectedId
      const agreements = _.get(props, 'agreements', [])
      for (const agrId in props.agreementsDict) {
        if (_.indexOf(agreements, agrId) < 0) {
          const agrInfo = props.agreementsDict[agrId]
          defaultSelectedId = agrId
          options.push({
            label: agrInfo.title,
            value: agrInfo.id
          })
        }
      }
      console.log('make select options, options', options)
      return {
        selectedId: state.selectedId || defaultSelectedId,
        selectOptions: options,
        prevAgreementsDict: props.agreementsDict,
        prevAgreements: props.agreements
      }
    } else {
      return null
    }
  }

  makeSelectOptions (props) {
    const { references, agreements } = props
    const options = []
    const agrDict = _.get(references, 'agreements', {})
    console.log('make select options, agrDict', agrDict)
    for (const agrId in agrDict) {
      if (!_.has(agreements, agrId)) {
        const agrInfo = agrDict[agrId]
        options.push({
          label: agrInfo.title,
          value: agrInfo.id
        })
      }
    }
    console.log('make select options, options', options)
    return options
  }

  handleChange = (v) => {
    console.log('handleChange', v)
    this.setState({ selectedId: v })
  }

  renderItem = (itemId) => {
    const { agreementsDict } = this.props
    return (
      <ResourceList.Item
        id={itemId}
        shortcutActions={[{ icon: 'delete', onAction: this.del(itemId) }]}
      >
        {_.get(agreementsDict, [itemId, 'title'])}
      </ResourceList.Item>
    )
  }

  del = (itemId) => () => {
    const { agreements, handleChange } = this.props
    const agreementsCopy = [ ...agreements ]
    agreementsCopy.splice(_.indexOf(agreementsCopy, itemId), 1)
    console.log('agreementsCopy', agreementsCopy)
    handleChange('agreements')(agreementsCopy)
  }

  add = () => {
    const { selectedId } = this.state
    const { agreements, handleChange } = this.props
    const agreementsCopy = [ ...agreements ]
    agreementsCopy.push(selectedId)
    console.log('agreementsCopy', agreementsCopy)
    handleChange('agreements')(agreementsCopy)
    this.setState({
      selectedId: null
    })
  }

  renderList = () => {
    const { agreements } = this.props
    if (agreements.length > 0) {
      return (
        <Card.Section>
          <ResourceList
            items={_.values(agreements)}
            renderItem={this.renderItem}
          />
        </Card.Section>
      )
    }
  }

  renderSelect = () => {
    const { selectOptions, selectedId } = this.state
    if (selectOptions.length > 0) {
      return (
        <Card.Section>
          <Stack alignment='trailing' distribution='fillEvenly'>
            <Select
              label='Choose agreement'
              options={selectOptions}
              onChange={this.handleChange}
              value={selectedId}
            />
            <Button onClick={this.add}>Add</Button>
          </Stack>
        </Card.Section>
      )
    }
  }

  render () {
    return (
      <Layout.AnnotatedSection
        title='Choose homeowner agreement'
        sectioned
      >
        <Card
          title='Agreements'
        >
          {this.renderSelect()}
          {this.renderList()}
        </Card>
      </Layout.AnnotatedSection>
    )
  }
}

ProposalAgreements.propTypes = {
  errors: PropTypes.object,
  resetError: PropTypes.func,
  handleChange: PropTypes.func,
  agreements: PropTypes.array
}

const mapStateToProps = state => ({
  agreementsDict: _.get(state, 'references.agreements', {})
})
export default connect(mapStateToProps)(ProposalAgreements)
