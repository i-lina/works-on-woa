import pandas as pd
import markdown as md
import re

df = pd.read_excel('data.xlsx')
for i, row in df.iterrows():

    d = row.to_dict()
    ver = str(d['VersionFrom'])
    compat = d['Compatibility']
    if compat == 'no' and (ver == 'TBD' or ver == 'NA'):
        continue

    name = re.sub('[^A-Za-z0-9]+', '', row['name'])
    name.replace('\'','')
    file = "./out/" + name + ".md"
    f = open(file, "w")
    f.write('---')
    f.write('\nname: ' + '"' + d['name'] + '"')
    #f.write('\nicon: ')
    category = '[app]'
    f.write('\ncategories: ' + category)
    if not str(d['link']) == 'No Hyperlink':
        f.write('\nlink: ' + str(d['link']))
    f.write('\ncompatibility: ' + d['Compatibility'])
    if not (ver == 'TBD' or ver == 'NA') :
        f.write('\nversionFrom: \"' + str(d['VersionFrom']) + '\"')
    f.write('\ntype: applications')
    notes = str(d['Notes'])
    if notes == 'nan':
        notes = ''
    f.write('\n---\n\n')
    f.write(notes)
    f.close()

