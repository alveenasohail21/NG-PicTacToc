/**
 * @ngdoc directive
 * @name app.dashboard.directive:lightSlider
 * @scope true
 * @param {object} test test object
 * @restrict E
 *
 * @description < description placeholder >
 *
 */

(function(){

  'use strict';

  angular
    .module('app.dashboard')
    .directive('pttLayouts', pttLayouts);

  /* @ngInject */
  function pttLayouts($timeout){

    // would be get from server, only active layouts will be shown
    var layouts = [
      {
        name: 'TWO HORIZONTAL ROWS',
        url: 'svgs/layout-1.svg',
        isActive: true,
        data: [
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width: 1,
            height: 0.5,
            percentValues: {
              left: 0,
              top: 0,
              width: 1,
              height: 0.5
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 2
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              },
              innerBorder: {
                top: {
                  value: false,
                  applyFactor: 1
                },
                left: {
                  value: false,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              outerBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              }
            }
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0.5,
            width: 1,
            height: 0.5,
            percentValues: {
              left: 0,
              top: 0.5,
              width: 1,
              height: 0.5
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              },
              innerBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              outerBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              }
            }
          }
        ]
      },
      {
        name: 'TWO VERTICAL COLUMNS',
        url: 'svgs/layout-2.svg',
        isActive: true,
        data: [
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width: 0.5,
            height: 1,
            percentValues: {
              left: 0,
              top: 0,
              width: 0.5,
              height: 1
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 2
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              },
              innerBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              outerBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 2
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              }
            }
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0.5,
            top: 0,
            width: 0.5,
            height: 1,
            percentValues: {
              left: 0.5,
              top: 0,
              width: 0.5,
              height: 1
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 2
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              },
              innerBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              outerBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 2
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              }
            }
          }
        ]
      },
      {
        name: '1 COLUMN IN 50%, 2 ROWS IN SECOND COLUMN',
        url: 'svgs/layout-3.svg',
        isActive: true,
        data: [
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width: 0.5,
            height: 1,
            percentValues: {
              left: 0,
              top: 0,
              width: 0.5,
              height: 1
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 2
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              },
              innerBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              outerBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 2
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              }
            }
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0.5,
            top: 0,
            width: 0.5,
            height: 0.5,
            percentValues: {
              left: 0.5,
              top: 0,
              width: 0.5,
              height: 0.5
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 2
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              },
              innerBorder: {
                top: {
                  value: false,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              outerBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              }
            }
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0.5,
            top: 0.5,
            width: 0.5,
            height: 0.5,
            percentValues: {
              left: 0.5,
              top: 0.5,
              width: 0.5,
              height: 0.5
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              },
              innerBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              outerBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              }
            }
          }
        ]
      },
      {
        name: '1 ROW IN 60%, 2 COLUMNS IN HALF HALF',
        url: 'svgs/layout-4.svg',
        isActive: true,
        data: [
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width: 1,
            height: 0.6,
            percentValues: {
              left: 0,
              top: 0,
              width: 1,
              height: 0.6
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              },
              innerBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 1
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              outerBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              }
            }
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0.6,
            width: 0.5,
            height: 0.4,
            percentValues: {
              left: 0,
              top: 0.6,
              width: 0.5,
              height: 0.4
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 2
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              },
              innerBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: false,
                  applyFactor: 1
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              },
              outerBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              }
            }
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0.5,
            top: 0.6,
            width: 0.5,
            height: 0.4,
            percentValues: {
              left: 0.5,
              top: 0.6,
              width: 0.5,
              height: 0.4
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: true,
                  applyFactor: 2
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              },
              innerBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              outerBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              }
            }
          }
        ]
      },
      {
        name: '4 EQUAL BOXES ',
        url: 'svgs/layout-5.svg',
        isActive: true,
        data: [
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width: 0.5,
            height: 0.5,
            percentValues: {
              left: 0,
              top: 0,
              width: 0.5,
              height: 0.5
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              },
              innerBorder: {
                top: {
                  value: false,
                  applyFactor: 1
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              outerBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              }
            }
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0.5,
            top: 0,
            width: 0.5,
            height: 0.5,
            percentValues: {
              left: 0.5,
              top: 0,
              width: 0.5,
              height: 0.5
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              },
              innerBorder: {
                top: {
                  value: false,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              outerBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: false,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              }
            }
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0.5,
            width: 0.5,
            height: 0.5,
            percentValues: {
              left: 0,
              top: 0.5,
              width: 0.5,
              height: 0.5
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 2
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              },
              innerBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              outerBorder: {
                top: {
                  value: false,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              }
            }
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0.5,
            top: 0.5,
            width: 0.5,
            height: 0.5,
            percentValues: {
              left: 0.5,
              top: 0.5,
              width: 0.5,
              height: 0.5
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 2
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              },
              innerBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: false,
                  applyFactor: 1
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              outerBorder: {
                top: {
                  value: false,
                  applyFactor: 1
                },
                left: {
                  value: false,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              }
            }
          }
        ]
      },
      {
        name: '3 COLUMN in ONE ROW, 1 ROW BOTTOM',
        url: 'svgs/layout-6.svg',
        isActive: true,
        data: [
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width: 0.33333,
            height: 0.5,
            percentValues: {
              left: 0,
              top: 0,
              width: 0.33333,
              height: 0.5
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              },
              innerBorder: {
                top: {
                  value: false,
                  applyFactor: 1
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 1
                },
                width: {
                  value: false,
                  applyFactor: 1
                }
              },
              outerBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              }
            }
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0.33333,
            top: 0,
            width: 0.33333,
            height: 0.5,
            percentValues: {
              left: 0.33333,
              top: 0,
              width: 0.33333,
              height: 0.5
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              },
              innerBorder: {
                top: {
                  value: false,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              },
              outerBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: false,
                  applyFactor: 1
                }
              }
            }
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0.66666,
            top: 0,
            width: 0.33333,
            height: 0.5,
            percentValues: {
              left: 0.66666,
              top: 0,
              width: 0.33333,
              height: 0.5
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              },
              innerBorder: {
                top: {
                  value: false,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              outerBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: false,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 1
                },
                width: {
                  value: true,
                  applyFactor: 1
                }
              }
            }
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0.5,
            width: 1,
            height: 0.5,
            percentValues: {
              left: 0,
              top: 0.5,
              width: 1,
              height: 0.5
            },
            fill: 'rgba(88,88,87,0.4)', /* use transparent for no fill */
            selectable: false,
            hasControls: false,
            hasBorders: false,
            stroke: 'rgb(101, 224, 228)',
            strokeWidth: 0,
            borders: {
              noBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              fullBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 2
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              },
              innerBorder: {
                top: {
                  value: true,
                  applyFactor: 1
                },
                left: {
                  value: false,
                  applyFactor: 0
                },
                height: {
                  value: false,
                  applyFactor: 0
                },
                width: {
                  value: false,
                  applyFactor: 0
                }
              },
              outerBorder: {
                top: {
                  value: false,
                  applyFactor: 0
                },
                left: {
                  value: true,
                  applyFactor: 1
                },
                height: {
                  value: true,
                  applyFactor: 2
                },
                width: {
                  value: true,
                  applyFactor: 2
                }
              }
            }
          }
        ]
      }
    ];

    return {
      restrict: 'E',
      link: link,
      templateUrl: 'src/dashboard/layouts/layouts.html',
      scope: {
        onSelect: '&onSelect'
      }
    };

    /////////////////////

    function link(scope, elem, attrs){

      // Initializer
      function init(){
        // TODO: Fetch texts from server
        setupLayouts();
      }

      // setup text
      function setupLayouts(){
        if(layouts.length>0){
          // console.log("RUNNING LAYOUTS SETUP: ");
          scope.layouts = layouts;
          loadLayouts();
        }
        else{
          // console.log("NO LAYOUT, NO SETUP");
        }
      }

      // load texts
      function loadLayouts(){
        for(var i=0; i<scope.layouts.length; i++){
          (function(){
            var layoutsToLoad = scope.layouts[i];
            // console.log("LOADING LAYOUTS: ", layoutsToLoad);

          }());
        }
      }

      // pagination


      // call initializer
      init();

    }

  }

}());
