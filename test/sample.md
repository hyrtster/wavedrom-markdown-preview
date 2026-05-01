# Wavedrom Timing Diagram Test

## Basic Signal Example

```wavedrom
{signal: [
  {name: 'clk',  wave: 'p.....|...'},
  {name: 'data', wave: 'x.3..4.x', data: ['a', 'b', 'c']},
  {name: 'req',  wave: '0...1...0'}
]}
```

## Multi-bit Bus with Clock

```wavedrom
{signal: [
  {name: 'clk',   wave: 'P.......'},
  {name: 'addr',  wave: 'x.3.4.x', data: ['A0', 'A1']},
  {name: 'data',  wave: 'x.3.4.x', data: ['D0', 'D1']},
  {name: 'write', wave: '0...1..0'}
]}
```

## With Edge Markers

```wavedrom
{signal: [
  {name: 'clk', wave: 'p.....|...'},
  {name: 'A',   wave: '0101....'},
  {name: 'B',   wave: '0.10....'},
],
edge: ['A->B t1', 'B-~>A t2']}
```

## Register Diagram

```wavedrom
{reg: [
  {name: 'Fields', bits: 8},
  {bits: 2, name: 'Type', attr: 'RO'},
  {bits: 1, name: 'Enable', attr: 'RW'},
  {bits: 5, name: 'Reserved', attr: 'RO', type: 1}
]}
```

## Using JSON5 Features (unquoted keys, trailing comma)

```wavedrom
{signal: [
  {name: 'clk', wave: 'p.....'},
  {name: 'out', wave: '0.1.0.'},
  {name: 'en',  wave: '1...0.',},
]}
```
