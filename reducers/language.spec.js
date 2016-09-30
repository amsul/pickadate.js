const ACTION        = require('constants/action')
const LANGUAGE      = require('constants/language')

let languageReducer = require('reducers/language')



describe('/languageReducer', () => {


  describe('#[ACTION.TYPE.SET_LANGUAGE]', () => {

    it('sets the language', () => {

      let state   = LANGUAGE.ENGLISH
      let payload = { value: LANGUAGE.FRENCH }

      languageReducer[ACTION.TYPE.SET_LANGUAGE](state, payload)
        .should.eql(LANGUAGE.FRENCH)

    })


    it('defaults to the original language', () => {

      let state   = LANGUAGE.ENGLISH
      let payload = { value: null }

      languageReducer[ACTION.TYPE.SET_LANGUAGE](state, payload)
        .should.eql(LANGUAGE.ENGLISH)

    })

  })


})