let jsUtil = require('utils/js')



describe('/jsUtil', () => {


  ///////////
  // RANGE //
  ///////////



  describe('#createRange', () => {

    it('creates a range from one index to another (inclusive)', () => {

      jsUtil.createRange(0, 3).should.eql([0, 1, 2, 3])
      jsUtil.createRange(2, 4).should.eql([2, 3, 4])

    })

  })





  ////////////
  // NUMBER //
  ////////////



  describe('#padZero', () => {

    it('pads a number with leading zeros to get a certain digits count', () => {

      jsUtil.padZero(5, 2).should.eql('05')
      jsUtil.padZero(5, 4).should.eql('0005')
      jsUtil.padZero(237, 4).should.eql('0237')
      jsUtil.padZero(1237, 4).should.eql('1237')
      jsUtil.padZero(51237, 4).should.eql('51237')

      jsUtil.padZero('5', 2).should.eql('05')
      jsUtil.padZero('5', 4).should.eql('0005')
      jsUtil.padZero('237', 4).should.eql('0237')
      jsUtil.padZero('1237', 4).should.eql('1237')
      jsUtil.padZero('51237', 4).should.eql('51237')

    })

  })





  ////////////
  // STRING //
  ////////////



  describe('#caseDash', () => {

    it('changes the letter case of a string to be "dashed"', () => {
      jsUtil.caseDash('ThisIsPascalCase').should.eql('this-is-pascal-case')
      jsUtil.caseDash('thisIsCamelCase').should.eql('this-is-camel-case')
    })

  })





  ///////////
  // ARRAY //
  ///////////



  describe('#isIncluded', () => {

    it('checks if a value is included in an array', () => {

      jsUtil.isIncluded([1, 2, 3], 2).should.eql(true)
      jsUtil.isIncluded([1, 2, 3], 3).should.eql(true)

      jsUtil.isIncluded([1, 2, 3], 4).should.eql(false)
      jsUtil.isIncluded([1, 2, 3], -1).should.eql(false)

      let object1 = { id: 123 }
      let object2 = { id: 124 }
      let object3 = { id: 123 }
      jsUtil.isIncluded([object1, object2], object1).should.eql(true)
      jsUtil.isIncluded([object1, object2], object3).should.eql(false)

    })


    it('checks if a value is included in an array using an identity matching method', () => {

      let object1 = { id: 123 }
      let object2 = { id: 124 }
      let object3 = { id: 123 }
      let object4 = { id: 125 }

      let identity = (item, value) => item.id === value.id

      jsUtil.isIncluded([object1, object2], object1, identity).should.eql(true)
      jsUtil.isIncluded([object1, object2], object3, identity).should.eql(true)
      jsUtil.isIncluded([object1, object2], object4, identity).should.eql(false)

    })

  })



  describe('#addToArray', () => {

    it('adds a value to an array and returns a new array', () => {

      let array = [1, 2, 3]

      let nextArray = jsUtil.addToArray(array, 4)

      nextArray.should.eql([1, 2, 3, 4])
      nextArray.should.not.be.exactly(array)

    })


    it('returns the original array if the value is already included', () => {

      let array = [1, 2, 3, 4]

      let nextArray = jsUtil.addToArray(array, 4)

      nextArray.should.eql([1, 2, 3, 4])
      nextArray.should.be.exactly(array)

    })


    it('adds a value to an array using an identity matching method', () => {

      let identity = (item, value) => item.id === value.id

      let array = [{ id: 1 }, { id: 2 }]

      let nextArray = jsUtil.addToArray(array, { id: 2 }, identity)

      nextArray.should.eql([{ id: 1 }, { id: 2 }])
      nextArray.should.be.exactly(array)

      nextArray = jsUtil.addToArray(array, { id: 3 }, identity)

      nextArray.should.eql([{ id: 1 }, { id: 2 }, { id: 3 }])
      nextArray.should.not.be.exactly(array)

    })

  })



  describe('#removeToArray', () => {

    it('removes a value from an array and returns a new array', () => {

      let array = [1, 2, 3, 4]

      let nextArray = jsUtil.removeFromArray(array, 4)

      nextArray.should.eql([1, 2, 3])
      nextArray.should.not.be.exactly(array)

    })


    it('returns the original array if the value is already not included', () => {

      let array = [1, 2, 3]

      let nextArray = jsUtil.removeFromArray(array, 4)

      nextArray.should.eql([1, 2, 3])
      nextArray.should.be.exactly(array)

    })


    it('removes a value from an array using an identity matching method', () => {

      let identity = (item, value) => item.id === value.id

      let array = [{ id: 1 }, { id: 2 }]

      let nextArray = jsUtil.removeFromArray(array, { id: 3 }, identity)

      nextArray.should.eql([{ id: 1 }, { id: 2 }])
      nextArray.should.be.exactly(array)

      nextArray = jsUtil.removeFromArray(array, { id: 2 }, identity)

      nextArray.should.eql([{ id: 1 }])
      nextArray.should.not.be.exactly(array)

    })

  })


})