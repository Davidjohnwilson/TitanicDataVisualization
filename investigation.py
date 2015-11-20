import csv
import datetime
import numpy as np
import matplotlib.pyplot as pyplot
from pandas import *

titanic_data = pandas.read_csv('./data/titanic.csv')

# print titanic_data.tail(1)

survived = titanic_data[titanic_data['Survived']==1]
died = titanic_data[titanic_data['Survived']==0]

def surv_died(dataset):
	su = dataset[dataset['Survived']==1]
	di = dataset[dataset['Survived']==0]
	print "Total survived: %i passengers." % len(su)
	print "Total died: %i passengers." % len(di)
	print "Survival Rate: %i percent." % (100.0*len(su)/(len(su)+len(di)))

def surv_rate(dataset):
	su = dataset[dataset['Survived']==1]
	di = dataset[dataset['Survived']==0]
	return 100.0*len(su)/(len(su)+len(di))

print "A total of %i passengers survived." % len(survived)
print "A total of %i passengers died." % len(died)

print "Therefore an average passenger had a %i percentage chance of surviving." % (100.0*len(survived)/(len(survived)+len(died)))

print "What about gender?"

male = titanic_data[titanic_data['Sex'] == 'male']
female = titanic_data[titanic_data['Sex'] == 'female']

m_s = male[male['Survived'] == 1]
m_d = male[male['Survived'] == 0]

print "Male:"
surv_died(male) 


print "Female:"
surv_died(female) 

#Age Ranges: <18,18-25,26-40,41-60,61+

kid = titanic_data[titanic_data['Age'] <= 18]
young = titanic_data[titanic_data['Age'] > 18][titanic_data['Age'] <= 30]
mid = titanic_data[titanic_data['Age'] > 30][titanic_data['Age'] <= 45]
old = titanic_data[titanic_data['Age'] > 45][titanic_data['Age'] <= 60]
older = titanic_data[titanic_data['Age'] > 60]

print "Under 18"
surv_died(kid) 

print "18-30"
surv_died(young) 

print "30-45"
surv_died(mid) 

print "45-60"
surv_died(old) 

print "60+"
surv_died(older) 

sibsp = titanic_data[titanic_data['SibSp'] > 0]
nosibsp = titanic_data[titanic_data['SibSp'] == 0]

print "SibSp:"
surv_died(sibsp) 


print "No SibSp:"
surv_died(nosibsp) 


def filter_tit_data(sex,min_age,max_age,sibsp):
	return titanic_data[titanic_data['Sex']==sex][titanic_data['Age'] > min_age][titanic_data['Age'] <= max_age][titanic_data['SibSp'] == sibsp]



def surv_rate(dataset):
	su = dataset[dataset['Survived']==1]
	di = dataset[dataset['Survived']==0]
	return [len(dataset),100.0*len(su)/(len(su)+len(di))]

gender = ['male','female']
ages = [[0,18],[18,30],[30,45],[45,60],[60,100]]
sibsp = [0,1]

for g in gender:
	for a in ages:
		for s in sibsp:
			if s == 1:
				sibstr = 'with a sibling or spouse'
			else:
				sibstr = 'without a sibling or spouse'
			s_r = surv_rate(filter_tit_data(g,a[0],a[1],s))
			print "A %s passenger between %i and %i years old %s. %i passengers with %i survival rate." % (g,a[0],a[1],sibstr,s_r[0],s_r[1])

















