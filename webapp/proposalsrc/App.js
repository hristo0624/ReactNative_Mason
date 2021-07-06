import React, { Component } from 'react'
import _ from 'lodash'

import { ref } from 'constants/firebase'
import 'src/styles/fonts.css'
import ErrorPage from 'proposalsrc/pages/ErrorPage'
import LoadingPage from 'proposalsrc/pages/LoadingPage'
import ProposalPage from 'proposalsrc/pages/ProposalPage'
import ContractPage from 'proposalsrc/pages/ContractPage'

const LOADING = 'LOADING'
const PROPOSAL = 'PROPOSAL'
const ERROR = 'ERROR'
const CONTRACT = 'CONTRACT'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mode: LOADING
    }
  }

  componentWillUnmount = () => {
    this.proposalRef.off()
  }

  async componentDidMount () {
    const pth = _.split(window.location.pathname, '/')
    console.log('CDM, window.location', pth)
    try {
      if (pth.length === 3) {
        const accId = pth[1]
        const docId = pth[2]
        this.proposalRef = ref.child(`/proposals/${accId}/${docId}`)
        this.proposalRef.on('value', proposalSN => {
          const proposal = proposalSN.val()
          console.log('proposal', proposal)
          if (_.isNil(proposal)) {
            this.setState({
              mode: ERROR,
              error: 'The requested document does not exist'
            })
          } else {
            this.setState({
              mode: this.state.mode === CONTRACT || _.has(proposal, 'accepted') ? CONTRACT : PROPOSAL,
              proposal,
              accId
            })
          }
        })
      } else {
        console.log('there should be an error page now')
        this.setState({
          mode: ERROR,
          error: 'The url is not correct'
        })
      }
    } catch (e) {
      console.log('cant get proposal', e)
      this.setState({
        mode: ERROR,
        error: e.code || e.message
      })
    }
  }

  onProposalAgree = async () => {
    const { proposal, accId } = this.state
    if (!proposal.accepted) await ref.child(`proposals/${accId}/${proposal.id}/accepted`).set(true)
    this.setState({
      mode: CONTRACT
    })
  }

  renderProposal = () => {
    const { proposal } = this.state
    return (
      <ProposalPage
        proposal={proposal}
        onAgree={this.onProposalAgree}
      />
    )
  }

  renderContract = () => {
    const { proposal, accId } = this.state
    return (
      <ContractPage
        accId={accId}
        proposal={proposal}
      />
    )
  }

  render () {
    const { mode, error } = this.state
    switch (mode) {
      case LOADING: return <LoadingPage />
      case ERROR: return <ErrorPage desc={error} />
      case PROPOSAL: return this.renderProposal()
      case CONTRACT: return this.renderContract()
      default: return <div>Not implemented</div>
    }
  }
}

export default App
