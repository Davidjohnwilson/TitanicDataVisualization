import csv
import datetime
import numpy as np
import matplotlib.pyplot as pyplot
from pandas import *
import itertools

titanic_data = pandas.read_csv('./data/summary_data.csv')

print titanic_data

def hamming_distance(data_1,data_2):
	dist = 0
	if data_1['Gender'] != data_2['Gender']:
		dist += 1
	if data_1['Age'] != data_2['Age']:
		dist += 1
	if data_1['SibSp'] != data_2['SibSp']:
		dist += 1
	return dist

with open('./data/link_data.csv', 'wb') as csvfile:
	spamwriter = csv.writer(csvfile, delimiter=',',
	                        quotechar='|', quoting=csv.QUOTE_MINIMAL)
	spamwriter.writerow(['id','id1','Gender1','Age1','SibSp1','SurvRate1','NumPassengers1','id2','Gender2','Age2','SibSp2','SurvRate2','NumPassengers2'])
	id_num = 0
	for i_ind, i_row in titanic_data.iterrows():
		for j_ind, j_row in titanic_data.iterrows():
			if j_ind > i_ind and  hamming_distance(i_row,j_row) == 1:
				id_num += 1
				spamwriter.writerow([id_num,i_row['id'],i_row['Gender'],i_row['Age'],i_row['SibSp'],i_row['SurvRate'],i_row['NumPassengers'],j_row['id'],j_row['Gender'],j_row['Age'],j_row['SibSp'],j_row['SurvRate'],j_row['NumPassengers']])

