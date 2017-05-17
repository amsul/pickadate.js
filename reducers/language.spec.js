const ACTION          = require('constants/action')
const LANGUAGE        = require('constants/language')
const languageReducer = require('reducers/language')



describe('/languageReducer', () => {


  describe('#[ACTION.TYPE.SET_LANGUAGE]', () => {

    it('sets the language', () => {

      const state   = LANGUAGE.ENGLISH
      const payload = { value: LANGUAGE.FRENCH }

      languageReducer[ACTION.TYPE.SET_LANGUAGE](state, payload)
        .should.eql(LANGUAGE.FRENCH)

    })


    it('defaults to the original language', () => {

      const state   = LANGUAGE.ENGLISH
      const payload = { value: null }

      languageReducer[ACTION.TYPE.SET_LANGUAGE](state, payload)
        .should.eql(LANGUAGE.ENGLISH)

    })

  })


})
