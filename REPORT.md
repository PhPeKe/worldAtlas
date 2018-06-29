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

      I tested the correlations between the variables and it didnt look nice, also i already had a cross-sectional(worldmap) and an average(barchart) visualization of the data. So the only thing missing was a longitudinal value that shows the development of series and offered an intuitive way of changing the years on the worldmap.


- *Statistics*
  - Calculate **mean** per series, year and country
    - Per series and per country for barchart

  - Calculate **z-scores**
    - (Value-population mean)/variance
    - Transposes all variables to one scale
    - Linegraph


### Defence
I chose for the linegraph instead of the scatterplot because it makes the design more consistent and because it offers a convinient and intuitive way to change the year on the worldmap. Also this way i can make use of the z-scores which give, in combination with the linegraph, a great overview of the relative development of a country compared to the world. I chose to use my visualizations as input because it looks a lot nicer than a lot of buttons on the page. This way i can make optimal use of the space i have. Overall im happy with design and functionality, although if i had more time i would really like to implement a second page with the scatterplot to correlate variables and countries as well as a t-test to test if differences between countries are significant. The implementation of a t-test should be simple because the z-scores are already there and it just has to be calculated if one datapoint is more than one and a half standard-deviations above the other. With the z-scores also different measures could be averaged so one could test if two countries differ in a combination of two variables.

## Flow:

*Follow this guide while going through the code numbers of the list below are also represented in the code*

*While going through the code follow the GUIDE comments*

1. Declare all veriables in main
2. Set standard selection
3. Load in Data
4. Aggregate data
  1. Prepare data
  2. Append data to structure
  3. Code NaN
5. Calculate statistics
  1. Initialize statistics+
  2. Total per country per series
  3. Mean per country per series
  4. Mean per series
  5. var, sd per country per series
  6. var, sd per series
  7. mean per series per year
  8. var per series per year
  9. z-scores
6. Draw visualizations for the first time
7. Draw World
  1. remove old world
  2. set size
  3. Append g to svg
  4. Fill map with color
  5. set listeners
  6. Adjust selection
8. Draw linegraph
  1. Set size
  2. Remove old elements
  3. declare variables
  4. Get data
  5. Prepare scale, line
  6. Create list with links to wikipedia page of selected countries
  7. Draw lines
  8. Create crosshair for linegraph
9. Draw Barchart
  1. Rmove old elements
  2. set size
  3. Prepare barchart, get data
  4. Set domain
  5. legend
  6. Draw new selection
10. Set listeners
11. Resize listener
