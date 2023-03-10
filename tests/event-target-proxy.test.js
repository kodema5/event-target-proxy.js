// deno test --watch
import { assert, assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { EventTargetProxy } from '../mod.js'

Deno.test('events as properties', () => {

    let es = new EventTargetProxy()

    var n = 0
    es['foo.fun1'] = (v) => n++
    es['foo'] = 'bar1'
    assert(n==1)

    n = 0
    es['foo.fun2'] = (v) => n++
    es['foo'] = 'bar2' // dispatch
    assert(n==2)

    assert('foo.fun2' in es)

    assertEquals(Object.getOwnPropertyNames(es), ['foo.fun1', 'foo.fun2'])
    assertEquals(Object.keys(es), ['foo.fun1', 'foo.fun2'])

    delete es['foo.fun2'] // removes
    assertEquals(Object.keys(es), ['foo.fun1'])
    assert('foo.fun1' in es)
})

Deno.test('using an existing event-target', () => {
    // for example dom-element
    //
    let es = new EventTargetProxy(new EventTarget())
    var n = 0
    es['foo.fun1'] = (v) => {n++}
    es['foo'] = 'bar1'
    assert(n==1)

})


Deno.test('delete using reg-exps', () => {
    let es = new EventTargetProxy()
    var n = 0

    // remove listeners of an event
    es['foo.fun1'] = (v) => {n++}
    es['foo.fun2'] = (v) => {n++}
    assert('foo.fun1' in es)
    assert('foo.fun2' in es)
    delete es['foo.*']
    assert(!('foo.fun1' in es))
    assert(!('foo.fun2' in es))


    // removes a set of data // .*\.abc$
    es['foo.fun1'] = (v) => {n++}
    es['bar.fun1'] = (v) => {n++}
    assert('foo.fun1' in es)
    assert('bar.fun1' in es)
    delete es['.fun1$']
    assert(!('foo.fun1' in es))
    assert(!('bar.fun1' in es))

})
