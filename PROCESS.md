# 04-06
- Chose a subject: Visualization of DNA
- Chose a backup subject: Visualizing a place (automatically create a text from it)
##ToDo:
Downlad data
Write proposal
Sketch prototype

# 05-06
- Subject and backup subject are not sufficient, had to choose new subject
- Visited worldbank data repository for inspiration, new subject is the connection between the state of a country (development, political situation) and how many arms it exports/imports
  - This works better because it can be visualized better
  - Enough data to feed 3 interactive connected views
- Began to collect data
- Re-delivered project proposal
- Proposal accepted
##ToDo:
Write design document
Aggregate data

# 06-06
- Meeting with group
- Aggregating data
- Creating design document

# 07-06
- Meeting with group
- Difficulties with parsing data into json with python script
  - Solved it by directly reading in the csv files using d3.csv
- Appending all data to worldmap-country-objects

# 11-06
- Combined all data with worldmap objects

# 12-06
- Combining data with worldmap to show colors
  - Combining data with worldmap data seems a bad choice
  - Building a large dataset with all data present
  - Objects that have country codes (numeric) as a key
  - Next level keys are names of data series
  - next level keys are years

# 13-06
- Tooltip works now (prototype)
- Writing function to return colors
- Combining all data in one dataset:
  - function aggregateData()
    - Problem: only the last dataset is saved in data structure
    - It seems like its a problem with referencing

# 14-06
- Trying to figure out the bug while loading in datasets
- Writing color function
- Coloring worldmap
- Solved the bug
- Problem: d3.extent expects a list not an object:
  - copying all values to a list before


# 15-06
- Finished loading in all data into an object that allows selection
##ToDo:
- Creating statistics and z-scores for all values
- Creating z-scores for the mean values per year and per country
  - This makes it possible to compare different variables in the same linegraph

# 18-06
- Creating statistics per series and per country
- Preparing Linegraph
- outsourcing functions

# 19-06
- Draw linegraph
- Bug: linegraph is not shown on the right space
  - First thought it was an issue of translate but then found out that the domains
    were not specified correctly
##Ideas:
- Select data for linegraph with marimekko chart
- Select point in time displayed on worldmap with crosshair linegraph
- Marimekko chart: Show data either per year or overall
  - Same button for worldmap

# 20-06
- Finished function to prepare data for the linechart
- Beginning with drawing all data

# 21-06
- Finished drawing all lines for the linegraph
- Now selecting countries from map
- Make list that is passed around between worldmap and linegraph
  - When country is clicked and not present it gets pushed to the list
  - When it is already present the list is spliced

# 22-06
- Selecting different series is now also changing the linegraph
- Selecting countries on worldmap is also changing the linegraph
- Clicking on the lines in the linegraph is deselecting countries
##ToDo:
- one click in linegraph selects countries to display in marimekko chart
- double click deselects country from linegraph
- Highlight selected countries on worldmap

# 23-06
- Marimekko chart does not work for the intended purpose
  - Changing to grouped barchart to compare between countries

# 25-06
- Preparing data for stacked barchart
- Implementing tooltip and linelabels for linegraph
- Drawing Stacked barchart
- Implementing tooltip for barchart
