import pandas as pd
import markdown as md
import re
import os
import markdown_to_json
import json

cat_dir = '../src/content/applications_categories/'
app_cat = { }

directory = os.fsencode(cat_dir)

for file in os.listdir(directory):
    filename = os.fsdecode(file)
    if filename.endswith(".md"):
        f = open(os.path.join(cat_dir, filename), 'r')
        md_text = f.read()
        md_json = markdown_to_json.jsonify(md_text)
        cat_dict = json.loads(md_json)
        s = cat_dict['root'][1]
        b = str(re.escape('name:'))
        e = str(re.escape('\ndescription:'))
        res = re.findall(b + "(.*)" + e, s)
        key = res[0].strip()
        app_cat[key] = os.path.splitext(filename)[0]
        f.close()

df = pd.read_excel('sample.xlsx')
for i, row in df.iterrows():

    d = row.to_dict()
    ver = str(d['Version'])
    compat = d['Compatibility']
    if compat == 'no' and (ver == 'TBD' or ver == 'NA'):
        continue

    name = re.sub('[^A-Za-z0-9]+', '', row['App Name'])
    name.replace('\'','')
    file = "./out/" + name + ".md"
    f = open(file, "w")
    f.write('---')
    f.write('\nname: ' + '"' + d['App Name'] + '"')
    #f.write('\nicon: ')
    category = str(d['Category'])
    if category == '' or category == 'nan':
        category = 'app'
    else:
        category = app_cat[category]
    category = '[\'' + category + '\']'
    f.write('\ncategories: ' + category)
    if not str(d['link']) == 'No Hyperlink':
        f.write('\nlink: ' + str(d['link']))
    f.write('\ncompatibility: ' + str(d['Compatibility']))
    if not (ver == 'TBD' or ver == 'NA') :
        f.write('\nversion: \"' + str(d['Version']) + '\"')
    f.write('\ntype: applications')
    if 'Notes' in d:
        notes = str(d['Notes'])
        if notes == 'nan':
            notes = ''
        f.write('\n---\n\n')
        f.write(notes)
    f.close()

