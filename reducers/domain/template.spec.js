const ACTION        = require('constants/action')
const domainReducer = require('reducers/domain')
const stateUtil     = require('utils/state')



describe('/domainReducer.template', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('sets the template', () => {

      const state   = stateUtil.getInitial()
      const payload = { template: 'YYYY-MM-DD' }

      const nextState = domainReducer
        .template[ACTION.TYPE.INITIALIZE](state, payload)

      nextState.should.not.be.exactly(state)
      nextState.should.eql({
        ...state,
        template: 'YYYY-MM-DD',
      })

    })


    it('defaults to the original state if no value is passed', () => {

      const state   = stateUtil.getInitial()
      const payload = { template: null }

      const nextState = domainReducer
        .template[ACTION.TYPE.INITIALIZE](state, payload)

      nextState.should.be.exactly(state)
      nextState.should.eql(state)

    })


    it('defaults to the original state if unchanged', () => {

      const state   = stateUtil.getInitial()
      const payload = { template: state.template }

      const nextState = domainReducer
        .template[ACTION.TYPE.INITIALIZE](state, payload)

      nextState.should.be.exactly(state)
      nextState.should.eql(state)

    })

  })


})
