# 04-06
- Chose a subject: Visualization of DNA
- Chose a backup subject: Visualizing a place (automatically create a text from it)
ToDo:
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
ToDo:
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
ToDo:


# 15-06
