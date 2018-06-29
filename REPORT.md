# Final Report
## WorldAtlas
### Phillip Kersten 10880682

## Description

![Final Version](/doc/screenshotFinal.PNG)
The Application aims at showing different aspects of data for multiple countries.
The data shown is about military variables, developmental factors and weapon import
and exports. The data is shown on a longitudinal(linegraph), cross-sectional(worldmap)
and on a averaged level(barchart).

### Here a short summary of the elements and their purpose:

- *Worldmap*
  - Show data per year per country as a heatmap relative to the other countries
  - Select country to display in the linegraph by clicking
  - Select up to 4 countries to compare to each other with the stacked barchart by clicking

- *Linegraph*
  - Shows Variables GDP, life expectancy and Military expenditure
    - These all give information about the development of a country
    - All variables on one scale
      - Z-scores (more about z-scores later)
    - Shows the time-trend of developmental factors compared to the rest of the world
      - Cross-sectional comparison: Every year-value is compared to the global mean per year
    - Mouseover selects years displayed on the worldmap
    - Static tooltips show exact values belonging to the z-scores
