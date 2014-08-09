describe('shadow.Picker', function() {

    it('is an instance of the shadow data field', function() {
        expect(shadow.DataElement.isClassOf(shadow.Picker)).toBe(true)
        expect(shadow.Picker.isInstanceOf(shadow.DataElement)).toBe(true)
    })


    describe('create()', function() {

        it('binds events that make the picker open and close', function() {

            var picker = shadow.Picker.create({
                $el: $('<div />')
            })
            var classes = picker.classNames

            expect(picker.attrs.opened).toBe(null)
            expect(picker.$el.hasClass(classes.opened)).toBe(false)

            picker.$el.trigger('click')

            expect(picker.attrs.opened).toBe(true)
            expect(picker.$el.hasClass(classes.opened)).toBe(true)

            $(document).trigger('click')

            expect(picker.attrs.opened).toBe(false)
            expect(picker.$el.hasClass(classes.opened)).toBe(false)
        })
    })


    describe('.template()', function() {

        it('builds out the picker’s template using the content', function() {

            var div = document.createElement('div')

            var text = document.createTextNode('content within. ')
            div.appendChild(text)

            var span = document.createElement('span')
            span.innerText = 'pretty neat yeah?'
            div.appendChild(span)

            expect(div.firstChild).toBe(text)

            var picker = shadow.Picker.create({
                $el: $(div)
            })

            expect(div.firstChild).not.toBe(text)
            expect(div.innerText).toBe('content within. pretty neat yeah?')
            expect(picker.content.firstChild).toBe(null)
        })
    })


    describe('.open()', function() {

        it('changes the picker’s state to be opened', function() {
            var picker = shadow.Picker.create({
                $el: $('<div />')
            })
            expect(picker.attrs.opened).toBe(null)
            picker.open()
            expect(picker.attrs.opened).toBe(true)
        })
    })


    describe('.close()', function() {

        it('changes the picker’s state to be closed', function() {
            var picker = shadow.Picker.create({
                $el: $('<div />'),
                attrs: {
                    opened: true
                }
            })
            expect(picker.attrs.opened).toBe(true)
            picker.close()
            expect(picker.attrs.opened).toBe(false)
        })
    })


    describe('.toggle()', function() {

        it('changes the picker’s state to toggle between opened and closed', function() {
            var picker = shadow.Picker.create({
                $el: $('<div />')
            })
            expect(picker.attrs.opened).toBe(null)
            picker.toggle()
            expect(picker.attrs.opened).toBe(true)
            picker.toggle()
            expect(picker.attrs.opened).toBe(false)
        })
    })


    describe('.attrs', function() {

        describe('.opened', function() {

            it('can be used to directly open or close the picker', function() {

                var picker = shadow.Picker.create({
                    $el: $('<div />')
                })
                var classes = picker.classNames

                expect(picker.$el.hasClass(classes.opened)).toBe(false)

                picker.attrs.opened = true
                expect(picker.$el.hasClass(classes.opened)).toBe(true)

                picker.attrs.opened = false
                expect(picker.$el.hasClass(classes.opened)).toBe(false)
            })
        })

    })

})
