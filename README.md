## World Atlas
*Phillip Kersten*

This project is aiming to show the difference between countries and groups of countries with respect to multiple variables concerning development, politics and conflict.
It is also possible to correlate different variables within a country or group countries and variables.

### Layout:
**MVP**:

![World-map in d3](/doc/world.png)
- A map to show chosen data accross time and to select countries for comparison
  - Dropdown selection of variables to show

![Scatterplot in d3](doc/scatter.png)
- A scatterplot to correlate two variables with each other within one country
  - Button to enable selection on map
  - Dropdowns for two variables to compare within one country

![Marimekko in d3](doc/marimekko.png)
- A Marimekko-chart to compare multiple countries with each other on multiple variables
  - Checkbox for multiple variables
  - Button to enable selection of up to 5 countries on the map

**Additional:**
- Window to group countries in
- Combine measures

### The variables are:
- Development/wealth
  - HDI (Human Development Index)
    - HDI per country
  - WDI (World development indicator)
    - Life expectancy at birth
    - GDP per capita

- Conflict
  - SIPRI
    - Arms imported/exported
    - % of armed forces in population
    - Military expenditure (% of GDP)
  - WDR (World development report)
    - Measures of war and terror

- Political situation
  - WDR (World development report 2011)
    - Democracy
      - Tutu Vanhanens index of democracy
  - WGI (World governance indicators)
    - Quality of the government
    - Corruption
### Countries can be grouped by:
- geographic location (e.g. continents)
- Political situation (democracy, autocracy, etc.)
- Development (1st, 2nd and 3rd world countries)
