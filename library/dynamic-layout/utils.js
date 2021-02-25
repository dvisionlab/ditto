// Dynamic layout utilities

// Layouts
const defaultLayout = { name: "single", panes: [{}] };

const twoPanesLayouts = [
  // 1x2
  { name: "1x2", panes: [{}, {}] },
  // 2x1
  { name: "2x1", horizontal: true, panes: [{}, {}] }
];

const threePanesLayouts = [
  // 1x3
  { name: "1x3", panes: [{}, {}, {}] },
  // 3x1
  { name: "3x1", horizontal: true, panes: [{}, {}, {}] },
  // (2x1)x1
  {
    name: "(2x1)x1",
    panes: [{ horizontal: true, panes: [{}, {}] }, { panes: [{}] }]
  }
];

const fourPanesLayouts = [
  // 2x2
  {
    name: "2x2",
    horizontal: true,
    panes: [{ panes: [{}, {}] }, { panes: [{}, {}] }]
  }
];

const veryComplexLayout = {
  name: "complex",
  panes: [
    // pane block with 80% size
    {
      panes: [
        { panes: [{}] },
        {
          horizontal: true,
          panes: [{ panes: [{}, {}, {}] }, { panes: [{}, { size: "67" }] }]
        }
      ],
      size: "80"
    },
    { horizontal: true, panes: [{}, {}] }
  ]
};

// Public data and methods
export const layouts = [
  defaultLayout,
  ...twoPanesLayouts,
  ...threePanesLayouts,
  ...fourPanesLayouts,
  veryComplexLayout
];
