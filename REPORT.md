# Final Report
## WorldAtlas
### Phillip Kersten 10880682

## Description

The Application aims at showing different aspects of data for multiple countries.
The data shown is about military variables, developmental factors and weapon import
and exports. The data is shown on a longitudinal(linegraph), cross-sectional(worldmap)
and on a averaged level(barchart).

![Final Version](/doc/screenshotFinal.PNG)

### Here a short summary of the elements and their purpose:

- *Worldmap* **(1)**
  - Show data per year per country as a heatmap relative to the other countries
  - Select country to display in the linegraph by clicking
  - Select up to 4 countries to compare to each other with the stacked barchart by clicking

- *Linegraph* **(2)**
  - Compares multiple series within one country
  - Always displays either the world mean or when a country was selected on the map the most recent selected country is shown
  - Shows Variables GDP, life expectancy and Military expenditure
    - These all give information about the development of a country
    - All variables on one scale
      - Standardized: Z-scores (more about z-scores later)
    - Shows the time-trend of developmental factors compared to the rest of the world
      - Cross-sectional comparison: Every year-value is compared to the global mean per year
    - Mouseover selects years displayed on the worldmap
    - Static tooltips show exact values belonging to z-scores **(5)**

- *Barchart* **(3)**
  - Compares countries across series
  - Countries selected on the map are displayed
  - Clicking the bar will select the series associated with the bar on the worldmap
  - Hovering over the abbreviated labels will reveal the full series names

- *List* **(4)**
  - Overview of countries selected for barchart
    - Clicking on the name will lead to the wikipedia-page for more information
  - When more than 4 countries are selected the country selected first is removed from the list

![Functional design](/doc/finalDesign.PNG)
*Final version of the functional design*

### Challenges:
- *Data*
  Finding data that can feed 3 visualizations *and* tell a nice story was hard. I searched for developmental factors in the worldbank database and chose for:

  - GDP per capita
    -Gives information about financial development
  - Life expectancy
    - Provides information about the medical/healthcare development
  - Military expenditure
    - Provides information about the importance of military services for the country

  First i thought that i could use the WDR database but it seemed that the download didnt work. I wrote an e-mail to the worldbank staff about this and got a reply in the last week of the project that the issue had been fixed. Fortunately the function for loading the data are general so that it wasnt much effort to add the missing datasets. The following data has been taken from the WDR database:

  - Battle deaths
    - Annual number of battle-deaths caused by civil uprisings
  - Civil war intensity
    - Estimate of intensity of civil war from SIPRI

- *Charts*
  - Stacked bargraph instead of marimekko
      These two charts are almost the same with behalf on one extra dimension: the column width. It would have been possible to implement this given my data but i chose to use the stacked barchart because otherwise the visualisations could have gotten too complex.
  - Linegraph instead of scatterplot
      
