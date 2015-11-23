import csv
import datetime
import numpy as np
import matplotlib.pyplot as pyplot
from pandas import *

titanic_data = pandas.read_csv('../data/titanic.csv')

def filter_tit_data(sex,age):

	ages = {'child': [0,18], 'young': [18,30], 'middle': [30,45], 'old': [45,60], 'older': [60,100]}

	data = titanic_data
	if str(sex) != 'all':
		data = data[data['Sex']==sex]
	if str(age) != 'all':
		min_age = ages[age][0]
		max_age = ages[age][1]
		data = data[data['Age'] > min_age][data['Age'] <= max_age]
	return data

def surv_rate(dataset):
	su = dataset[dataset['Survived']==1]
	di = dataset[dataset['Survived']==0]
	return [len(dataset),int(100.0*len(su)/(len(su)+len(di)))]

gender = ['all','male','female']
ages = ['all','child','young','middle','old','older']


with open('../data/summary_data_2.csv', 'wb') as csvfile:
	spamwriter = csv.writer(csvfile, delimiter=',',
	                        quotechar='|', quoting=csv.QUOTE_MINIMAL)
	spamwriter.writerow(['id','Gender','Age','SurvRate','NumPassengers'])
	id_num = 0
	for g in gender:
		for a in ages:
				if (g == 'all' and a != 'all'):
					continue
				s_r = surv_rate(filter_tit_data(g,a))
				id_num += 1
				spamwriter.writerow([id_num,g,a,s_r[1],s_r[0]])



