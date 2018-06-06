# Design
*Phillip Kersten*

## Data Sources:
Worldbank:
- WDI (World development indicators)
  - Life expectancy at birth
  - GDP per capita
  - Worth import/export of weapons
  - Military expenditure (%of GDP)
  - Armed forces personnel (%of population)

All data is aggregated by hand in excel, then saved as csv and converted to json using python.

## Component-diagram
![Component-Diagram](/doc/design.PNG)

## Components
**Worldmap**
- Shows developmental-variables (Life expectancy, GDP)
- Is updated when slider is moved

**Scatterplot**
- Shows variable selected on map on one axis
- Other axis is chosen with Dropdown

**Marimekko**
- Shows variables selected with checkboxes for each country selected
- Up to 5 countries can be selected by clicking on them on the map

## Plugins needed
- d3 geo projection
- d3 array
- d3 geo
- d3 queue
- d3 topojson
- d3 simple slider
- d3 tooltip
- bootstrap

## Functions
**Update Map**
- Update worldmap when data is selected
- Also updates Scatterplot

**Update Scatterplot**
- Update when data is selected in Dropdown
- Is also triggered when data is updated for Worldmap

**Update Marimekko**
- Update when data is chosen in checkboxes

**Update all**
- Update all charts when year is changed 
