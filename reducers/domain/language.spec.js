const ACTION        = require('constants/action')
const LANGUAGE      = require('constants/language')
const domainReducer = require('reducers/domain')



describe('/domainReducer.language', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('sets the language', () => {

      const state   = { language: LANGUAGE.ENGLISH }
      const payload = { language: LANGUAGE.FRENCH }

      const nextState = domainReducer
        .language[ACTION.TYPE.INITIALIZE](state, payload)

      nextState.should.not.be.exactly(state)
      nextState.should.eql({ language: LANGUAGE.FRENCH })

    })


    it('defaults to the original state if no value is passed', () => {

      const state   = { language: LANGUAGE.ENGLISH }
      const payload = { language: null }

      const nextState = domainReducer
        .language[ACTION.TYPE.INITIALIZE](state, payload)

      nextState.should.be.exactly(state)
      nextState.should.eql({ language: LANGUAGE.ENGLISH })

    })


    it('defaults to the original state if unchanged', () => {

      const state   = { language: LANGUAGE.ENGLISH }
      const payload = { language: LANGUAGE.ENGLISH }

      const nextState = domainReducer
        .language[ACTION.TYPE.INITIALIZE](state, payload)

      nextState.should.be.exactly(state)
      nextState.should.eql({ language: LANGUAGE.ENGLISH })

    })

  })



  describe('#[ACTION.TYPE.SET_LANGUAGE]', () => {

    it('uses the sample implementation as #[ACTION.TYPE.INITIALIZE]', () => {
      domainReducer.language[ACTION.TYPE.SET_LANGUAGE]
        .should.be.exactly(domainReducer.language[ACTION.TYPE.INITIALIZE])
    })

  })


})
