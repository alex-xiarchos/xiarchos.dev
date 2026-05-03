---
title: Human Activity Classification & Clustering System
date: 2026-05-03
template: page
slug: projects/human-activity-classification-clustering-system
description: Project writeup for Human Activity Classification & Clustering System.
comments_off: true
---

The dataset includes 22 `.csv` files corresponding to 22 participants. According to the dataset [description](https://archive.ics.uci.edu/dataset/779/harth),
it includes the `timestamp` column with the date and time, the `back_{x,y,z}` and `thigh_{x,y,z}` columns
with each sensor value for each dimension, and the `label` column, which identifies the participant's activity at that moment.

The `label` column takes the following values:

- 1 - Walking
- 2 - Running
- 3 - Shuffling
- 4 - Stairs (ascending)
- 5 - Stairs (descending)
- 6 - Standing
- 8: lying
- 13 - Cycling (sit)
- 14 - Cycling (stand)
- 130 - Cycling (sit, inactive)
- 140 - Cycling (stand, inactive)

For importing and preprocessing the files, we will use the `pandas` library,
while for visualization we will use Python's `matplotlib` and `seaborn` libraries.

## DATASET ANALYSIS

We import the `.csv` files using the `os` library and the `read_csv()` function.
First, by using `head()`, we can view the first records of our dataset.
For example, for the first file of the dataset, `S006.csv`:

|  | timestamp | back_x | back_y | back_z | thigh_x | thigh_y | thigh_z | label |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 2019-01-12 00:00:00.000 | -0.760242 | 0.299570 | 0.468570 | -5.092732 | -0.298644 | 0.709439 | 6 |
| 1 | 2019-01-12 00:00:00.010 | -0.530138 | 0.281880 | 0.319987 | 0.900547 | 0.286944 | 0.340309 | 6 |
| 2 | 2019-01-12 00:00:00.020 | -1.170922 | 0.186353 | -0.167010 | -0.035442 | -0.078423 | -0.515212 | 6 |
| 3 | 2019-01-12 00:00:00.030 | -0.648772 | 0.016579 | -0.054284 | -1.554248 | -0.950978 | -0.221140 | 6 |
| 4 | 2019-01-12 00:00:00.040 | -0.355071 | -0.051831 | -0.113419 | -0.547471 | 0.140903 | -0.653782 | 6 |

Using `info()`, we conclude that for each point in time the sensor values are provided, stored as `float24`,
in the three dimensions (x, y, z) for the back and thigh areas, as well as an `int64` for `label`.
The same structure is observed in all `.csv` files of the dataset, with some differences that will be analyzed below.

Although the description states that there are no missing values, to check the integrity of the dataset we use the
`concat()` function to merge all 22 files into a single dataframe, `df_combined`. Running `isnull().sum()`, we get:

|  | sum |
| --- | --- |
| timestamp | 0 |
| back_x | 0 |
| back_y | 0 |
| back_z | 0 |
| thigh_x | 0 |
| thigh_y | 0 |
| thigh_z | 0 |
| label | 0 |
| index | 5740689 |
| Unnamed: 0 | 6323682 |

We observe that in the `back_{x,y,z}` and `thigh_{x,y,z}` columns, which are the ones we are interested in, no missing values are indeed observed.
However, `NaN` values appear in the `"index"` and `"Unnamed: 0"` columns, which probably appear as extra columns in some files.

After checking all files, the `"index"` column appears in `S015.csv` and `S021.csv`, and the `"Unnamed: 0"` column appears in `S023.csv`.
After inspection, these seem to be increasing index columns that do not provide useful information.
Therefore, we can remove them using the `drop('name', axis=1)` function. The processed `.csv` files are saved with the `fix` suffix.

Using the `describe()` function, we can calculate basic statistical metrics for our data.
The function returns a dataframe with the following columns:

- `count`: the total number of non-null values for each column.
- `mean`: the average value for each column.
- `min`: the minimum value for each column.
- `25%`: the value of the 25th percentile for each column.
- `50%`: the value of the 50th percentile for each column.
- `75%`: the value of the 75th percentile for each column.
- `max`: the maximum value for each column.

After combining all participants' measurements into `df_combined`,
these are the **basic aggregate statistics** produced by `describe()`
for all participant measurements, after removing the `label` attribute since it consists of categorical values:

|  | back_x | back_y | back_z | thigh_x | thigh_y | thigh_z |
| --- | --- | --- | --- | --- | --- | --- |
| count | 6461328 | 6461328 | 6461328 | 6461328 | 6461328 | 6461328 |
| mean | -0.884957 | -0.013261 | -0.169378 | -0.594888 | 0.020877 | 0.374916 |
| std | 0.377592 | 0.231171 | 0.364738 | 0.626347 | 0.388451 | 0.736098 |
| min | -8.000000 | -4.307617 | -6.574463 | -8.000000 | -7.997314 | -8.000000 |
| 25% | -1.002393 | -0.083129 | -0.372070 | -0.974211 | -0.100087 | -0.155714 |
| 50% | -0.974900 | 0.002594 | -0.137451 | -0.421731 | 0.032629 | 0.700439 |
| 75% | -0.812303 | 0.072510 | 0.046473 | -0.167876 | 0.154951 | 0.948675 |
| max | 2.291708 | 6.491943 | 4.909483 | 7.999756 | 7.999756 | 8.406235 |

As initial observations, we see that the values lie in the interval $ [-8, 8]$, while their standard deviation is small,
which indicates that the measurements are fairly concentrated around the mean, which is close to zero.
Obviously, by checking each participant separately, corresponding conclusions can be drawn.

## VISUALIZATIONS

Using Matplotlib's `plotbox()`, we can create
a plot of the `df_combined` values as an initial visualization of the data:

[//]: # (![df_combined_boxplot]&#40;df_combined_boxplot.png&#41;)

In addition to confirming the previous observations, we also observe symmetry near zero
for each dimension. Also, by using `displot()`, we can visualize the distribution of the values.
Indicatively, for `S009`:

[//]: # (![S009_back_distribution]&#40;img/S009_back_distribution.png&#41;)
[//]: # (![S009_thigh_distribution]&#40;img/S009_thigh_distribution.png&#41;)

Using `plot()`, we can create subplots for the `back_{x,y,z}`
and `thigh_{x,y,z}` columns. These, for example, are the subplots for participant `S015`:

[//]: # (![S015_back]&#40;img/waveforms/S015_back.png&#41;)
[//]: # (![S015_thigh]&#40;img/waveforms/S015_thigh.png&#41;)

It appears that during the measurement the participant changes physical activity (in fact, in a similar way for the back and thigh),
as there are moments when there are no strong fluctuations in the sensor measurement values and others when the participant is more active,
with the `label` value also changing. At the moments when the participant is not moving, `label`
appears to take the value `8 - Standing`, which confirms the lack of movement.

On the other hand, for participant `S029` we observe that the movement of the back does not match the (intense) movement of the thighs,
which leads us to the conclusion that the participant is cycling.
This is also confirmed by the spikes of `label` at values around 100.

[//]: # (![S029_back]&#40;img/waveforms/S029_back.png&#41;)
[//]: # (![S029_thigh]&#40;img/waveforms/S029_thigh.png&#41;)

Finally, participant `S027` appears to have very intense physical activity, with `label`
remaining stable at a value close to 2.5, from which we can infer that the participant is running:

[//]: # (![S027_back]&#40;img/waveforms/S027_back.png&#41;)
[//]: # (![S027_thigh]&#40;img/waveforms/S027_thigh.png&#41;)

Finally, to detect correlations, we can create a `heatmap()` using `seaborn`.
For example, for participant `S008` there appears to be some correlation between the `back_x` + `back_z`,
`thigh_x` + `thigh_z`, and `back_z` + `thigh_x` columns, while for `S015` there is correlation between `back_x` + `back_z` and `back_y` + `thigh_y`.

[//]: # (![S008_heatmap]&#40;img/heatmaps/S008_heatmap.png&#41;)
[//]: # (![S015_heatmap]&#40;img/heatmaps/S015_heatmap.png&#41;)

By also creating a heatmap for the aggregate dataframe `df_combined`, we observe a weak correlation
between `thigh_x` + `back_x` and `thigh_x` + `thigh_z`.

[//]: # (![df_combined_heatmap]&#40;df_combined_heatmap.png&#41;)

The appendix includes the plots and heatmaps for all participants.

## CLASSIFIER DEFINITION

In the `get_classifier(option)` function, the classifiers that will be used later are defined and can be selected.

For each classifier case, in each of the 22 dataframes of the dataset, the `timestamp` column is removed,
and the dataframe is separated from the `label` column into `X` and `Y`. After this separation, the dataframes
`X_train`, `X_test`, `Y_train`, and `Y_test` are split with `test_size = 0.3`.

The `MLPClassifier` runs with `max_iter=500`, and the `RandomForestClassifier` with `n_estimators=100, criterion='entropy'`.

After the classifier is selected, it is trained using `fit(X_train, Y_train)`, and its predictions are stored using `predict(X_test)`.

As a result, all three classifiers are executed for all files, and the `training accuracy` is stored,
as well as the metrics from `sklearn.metrics`: `testing accuracy`, `precision`, `recall`, and `f1`.

## RESULTS

We run each classifier for all participants:

### NEURAL NETWORKS

| file | training accuracy | testing accuracy |
| --- | --- | --- |
| S006.csv | 0.9141337173536156 | 0.9122442155399509 |
| S008.csv | 0.9329507794280103 | 0.9315337677112421 |
| S009.csv | 0.8956013466020495 | 0.8916271040138111 |
| S010.csv | 0.8519300925436921 | 0.8499360159249254 |
| S012.csv | 0.9738502515979364 | 0.9730834604488996 |
| S013.csv | 0.9007985198546176 | 0.8996423539612008 |
| S014.csv | 0.8991970063148047 | 0.8973778274987039 |
| S015_fix.csv | 0.9135976563300259 | 0.9136856865150815 |
| S016.csv | 0.9141337173536156 | 0.9447883255491156 |
| S017.csv | 0.9329507794280103 | 0.9109135048143804 |
| S018.csv | 0.8956013466020495 | 0.8708032518979748 |
| S019.csv | 0.8519300925436921 | 0.9578000537008861 |
| S020.csv | 0.9542851869085204 | 0.9545083401376414 |
| S021_fix.csv | 0.9347834306997145 | 0.9334105321202095 |
| S022.csv | 0.9020188641720371 | 0.9002873194379992 |
| S023_fix.csv | 0.9318747924277648 | 0.9256308422531119 |
| S024.csv | 0.9218583766848449 | 0.9191376243623073 |
| S025.csv | 0.8687010665187103 | 0.8650728577798875 |
| S026.csv | 0.8737227345922998 | 0.8699446645716628 |
| S027.csv | 0.9876495387719804 | 0.9867580292584497 |
| S028.csv | 0.9772106137134159 | 0.9761270533155749 |
| S029.csv | 0.9475463825229214 | 0.9443625850974541 |

### RANDOM FOREST

| file | training accuracy | testing accuracy |
| --- | --- | --- |
| S006.csv | 1.0 | 0.9306598810892809 |
| S008.csv | 1.0 | 0.9432683357598033 |
| S009.csv | 0.9999907513595502 | 0.8979499352611136 |
| S010.csv | 0.9999918750050781 | 0.8659367742547041 |
| S012.csv | 0.9999962643216569 | 0.9788363477881892 |
| S013.csv | 1.0 | 0.9186264947075612 |
| S014.csv | 1.0 | 0.9186264947075612 |
| S015_fix.csv | 0.9999863422495681 | 0.9243216112430089 |
| S016.csv | 1.0 | 0.9555080374392737 |
| S017.csv | 0.9999922065574026 | 0.9255794077266487 |
| S018.csv | 0.9999955671597462 | 0.8967336215634761 |
| S019.csv | 0.9999952052397141 | 0.9646916674125123 |
| S020.csv | 1.0 | 0.959730459672137 |
| S021_fix.csv | 1.0 | 0.9460601047697822 |
| S022.csv | 1.0 | 0.9111284446243619 |
| S023_fix.csv | 0.9999896213882431 | 0.9385867196202838 |
| S024.csv | 0.999983245792599 | 0.9339926897441411 |
| S025.csv | 0.999987670303927 | 0.8797307210978293 |
| S026.csv | 0.999992680427463 | 0.8916006285011614 |
| S027.csv | 1.0 | 0.9887968723726248 |
| S028.csv | 0.9999827025531032 | 0.9785890140049239 |
| S029.csv | 1.0 | 0.9555348316702416 |

### BAYESIAN NETWORKS

| file | training accuracy | testing accuracy |
| --- | --- | --- |
| S006.csv | 0.8708720149879761 | 0.8709109148295858 |
| S008.csv | 0.8950056598884388 | 0.8940945289068156 |
| S009.csv | 0.8275868447338242 | 0.8281398359948209 |
| S010.csv | 0.7653420216612364 | 0.7660552632826201 |
| S012.csv | 0.9394446540575070 | 0.9392373066027457 |
| S013.csv | 0.8135999969034615 | 0.8122538925616849 |
| S014.csv | 0.8498128946752943 | 0.8503005993797011 |
| S015_fix.csv | 0.8722966190238806 | 0.8719307191000494 |
| S016.csv | 0.8932883694009454 | 0.8942753174647835 |
| S017.csv | 0.8588490643972162 | 0.8601511142631134 |
| S018.csv | 0.7839300675121571 | 0.7838997952048985 |
| S019.csv | 0.8906698759595514 | 0.8916248993108387 |
| S020.csv | 0.9124273688986991 | 0.9138529731087762 |
| S021_fix.csv | 0.8831981547652809 | 0.8823821339950372 |
| S022.csv | 0.8233673689600163 | 0.8252288188307777 |
| S023_fix.csv | 0.7625996346728662 | 0.7668668571705333 |
| S024.csv | 0.7699228468749215 | 0.7724438537166982 |
| S025.csv | 0.6912890697244313 | 0.6867043542053252 |
| S026.csv | 0.7031474161908945 | 0.7008300314250581 |
| S027.csv | 0.9621288555779763 | 0.9618715318648058 |
| S028.csv | 0.9570936829723933 | 0.9572385680267991 |
| S029.csv | 0.7504656237759890 | 0.7464329012403246 |

### AVERAGES

Using `np.mean()`, the averages of the model results are calculated:

|  | classifier | score | accuracy | precision | recall | f1 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | MLPClassifier | 0.9215787974 | 0.9197436955 | 0.7644127233 | 0.6806597787 | 0.6976677241 |
| 2 | RandomForestClassifier | 0.9999962322 | 0.9317139313 | 0.8322693957 | 0.7073846769 | 0.7384389196 |
| 3 | GaussianNB | 0.8403413636 | 0.8403609059 | 0.5568391564 | 0.5460153011 | 0.5208372416 |

[//]: # (![models_train_test]&#40;img/models_train_test.png&#41;)
[//]: # (![models_metrics]&#40;img/models_metrics.png&#41;)

## CONCLUSIONS

We observe that the training accuracy of Random Forest is almost perfect and higher than the testing accuracy.
This leads us to conclude that overfitting is likely: performance on the training data is excessively good, and the model does not generalize enough to perform as well on the test data.
Combined with the lower accuracy of the Bayesian Networks, the best possible choice is Neural Networks.

# QUESTION 3

To begin, we will use the KMeans algorithm from `sklearn.cluster` for clustering.
First, we pass the data through a scaler, specifically `StandardScaler()`, which normalizes them so they are uniform.
This process is necessary because the algorithm is sensitive to small changes in the data and requires standardization.

Since we have multidimensional data, dimensionality reduction is necessary so that the data can be visualized in two dimensions.
For this reason, we use PCA from `sklearn.decomposition`. Ultimately, the KMeans algorithm creates the following 5 clusters:

[//]: # (![Kmeans_clustering]&#40;img/Kmeans_clustering.png&#41;)

An alternative method for clustering is to use the DBSCAN algorithm, also from `sklearn.cluster`.
DBSCAN creates clusters of any shape and is less affected by outliers.
The number of clusters is not predefined; instead, an `eps` value is set, which controls the maximum distance between two samples that belong to the same cluster.
It is computationally slower, but it is said to produce better results.

[//]: # (![DBSCAN_clustering]&#40;img/DBSCAN_clustering.png&#41;)

Due to the very large dataset and the long computation time, the algorithm was executed only on one `.csv` file instead of `df_combined`.

## CONCLUSIONS

Although the algorithm was tuned considerably and different `eps` values were tested, apart from the very beginning of its execution,
it did not create clear clusters, even though it was run on a much smaller set compared with KMeans. The multiple dimensions of the data may be responsible for this (curse of dimensionality).
By contrast, KMeans immediately created clear clusters in a very short time on a large number of data points.

Ultimately, due to the structure of this specific dataset, which does not include noise or many outliers, KMeans performs better.

[//]: # (## APPENDIX)

[//]: # (## PLOTS)

[//]: # (![S006_back]&#40;img/waveforms/S006_back.png&#41;)
[//]: # (![S006_thigh]&#40;img/waveforms/S006_thigh.png&#41;)

[//]: # (![S008_back]&#40;img/waveforms/S008_back.png&#41;)
[//]: # (![S008_thigh]&#40;img/waveforms/S008_thigh.png&#41;)

[//]: # (![S009_back]&#40;img/waveforms/S009_back.png&#41;)
[//]: # (![S009_thigh]&#40;img/waveforms/S009_thigh.png&#41;)

[//]: # (![S010_back]&#40;img/waveforms/S010_back.png&#41;)
[//]: # (![S010_thigh]&#40;img/waveforms/S010_thigh.png&#41;)

[//]: # (![S012_back]&#40;img/waveforms/S012_back.png&#41;)
[//]: # (![S012_thigh]&#40;img/waveforms/S012_thigh.png&#41;)

[//]: # (![S013_back]&#40;img/waveforms/S013_back.png&#41;)
[//]: # (![S013_thigh]&#40;img/waveforms/S013_thigh.png&#41;)

[//]: # (![S014_back]&#40;img/waveforms/S014_back.png&#41;)
[//]: # (![S014_thigh]&#40;img/waveforms/S014_thigh.png&#41;)

[//]: # (![S015_back]&#40;img/waveforms/S015_back.png&#41;)
[//]: # (![S015_thigh]&#40;img/waveforms/S015_thigh.png&#41;)

[//]: # (![S016_back]&#40;img/waveforms/S016_back.png&#41;)
[//]: # (![S016_thigh]&#40;img/waveforms/S016_thigh.png&#41;)

[//]: # (![S017_back]&#40;img/waveforms/S017_back.png&#41;)
[//]: # (![S017_thigh]&#40;img/waveforms/S017_thigh.png&#41;)

[//]: # (![S018_back]&#40;img/waveforms/S018_back.png&#41;)
[//]: # (![S018_thigh]&#40;img/waveforms/S018_thigh.png&#41;)

[//]: # (![S019_back]&#40;img/waveforms/S019_back.png&#41;)
[//]: # (![S019_thigh]&#40;img/waveforms/S019_thigh.png&#41;)

[//]: # (![S020_back]&#40;img/waveforms/S020_back.png&#41;)
[//]: # (![S020_thigh]&#40;img/waveforms/S020_thigh.png&#41;)

[//]: # (![S021_back]&#40;img/waveforms/S021_back.png&#41;)
[//]: # (![S021_thigh]&#40;img/waveforms/S021_thigh.png&#41;)

[//]: # (![S022_back]&#40;img/waveforms/S022_back.png&#41;)
[//]: # (![S022_thigh]&#40;img/waveforms/S022_thigh.png&#41;)

[//]: # (## HEATMAPS)

[//]: # (![S006_heatmap]&#40;img/heatmaps/S006_heatmap.png&#41;)
[//]: # (![S008_heatmap]&#40;img/heatmaps/S008_heatmap.png&#41;)
[//]: # (![S009_heatmap]&#40;img/heatmaps/S009_heatmap.png&#41;)
[//]: # (![S010_heatmap]&#40;img/heatmaps/S010_heatmap.png&#41;)
[//]: # (![S012_heatmap]&#40;img/heatmaps/S012_heatmap.png&#41;)
[//]: # (![S013_heatmap]&#40;img/heatmaps/S013_heatmap.png&#41;)
[//]: # (![S014_heatmap]&#40;img/heatmaps/S014_heatmap.png&#41;)
[//]: # (![S015_heatmap]&#40;img/heatmaps/S015_heatmap.png&#41;)
[//]: # (![S016_heatmap]&#40;img/heatmaps/S016_heatmap.png&#41;)
[//]: # (![S017_heatmap]&#40;img/heatmaps/S017_heatmap.png&#41;)
[//]: # (![S018_heatmap]&#40;img/heatmaps/S018_heatmap.png&#41;)
[//]: # (![S019_heatmap]&#40;img/heatmaps/S019_heatmap.png&#41;)
[//]: # (![S020_heatmap]&#40;img/heatmaps/S020_heatmap.png&#41;)
[//]: # (![S021_heatmap]&#40;img/heatmaps/S021_heatmap.png&#41;)
[//]: # (![S022_heatmap]&#40;img/heatmaps/S022_heatmap.png&#41;)
[//]: # (![S023_heatmap]&#40;img/heatmaps/S023_heatmap.png&#41;)
[//]: # (![S024_heatmap]&#40;img/heatmaps/S024_heatmap.png&#41;)
[//]: # (![S025_heatmap]&#40;img/heatmaps/S025_heatmap.png&#41;)
[//]: # (![S026_heatmap]&#40;img/heatmaps/S026_heatmap.png&#41;)
[//]: # (![S027_heatmap]&#40;img/heatmaps/S027_heatmap.png&#41;)
[//]: # (![S028_heatmap]&#40;img/heatmaps/S028_heatmap.png&#41;)
[//]: # (![S029_heatmap]&#40;img/heatmaps/S029_heatmap.png&#41;)

## CODE

### `data_analysis.ipynb`

```python
import seaborn as sns
import pandas as pd
import os
import matplotlib.pyplot as plt

file_list = ['S006.csv','S008.csv','S009.csv','S010.csv','S012.csv','S013.csv','S014.csv','S015_fix.csv','S016.csv',
         'S017.csv','S018.csv','S019.csv','S020.csv','S021_fix.csv','S022.csv','S023_fix.csv','S024.csv','S025.csv',
         'S026.csv','S027.csv','S028.csv','S029.csv',]

# Append all df's into a single combined dataframe
df_combined = pd.DataFrame()

for file in file_list:
    df = pd.read_csv(os.path.join('harth/', file))
    df_combined = pd.concat([df_combined, df])

df_combined = df_combined.drop('label', axis=1)

# Remove unnecessary columns
df = pd.read_csv(os.path.join('harth/', file_list[7]))
df = df.drop('index', axis=1)
df.to_csv('harth/S015_fix.csv', index=False)

# Create tables
df = pd.read_csv(os.path.join('harth/', file_list[0]))
df.head()
df.info()
df_combined.describe()

# Create plots
for file in file_list:
    df = pd.read_csv(os.path.join('harth/', file_list[1]))
    df[['back_x','back_y', 'back_z', 'label']].plot(title= file, subplots=True)
    plt.show()
    df[['thigh_x','thigh_y', 'thigh_z', 'label']].plot(title= file, subplots=True)
    plt.show()

# Heatmaps
    for file in file_list:
        df = pd.read_csv(os.path.join('harth/', file))
        my_columns = ['back_x', 'back_y', 'back_z', 'thigh_x', 'thigh_y', 'thigh_z']
        df_selected = df[my_columns]

        corr_df = df_selected.corr()
        sns.heatmap(corr_df, annot=True, cmap='coolwarm')
        plt.title(file)

        # Save to file:
        folder_path = 'Report/src/img/heatmaps'
        fig_name = file.replace(".csv","") + '_heatmap.png'
        plt.savefig(os.path.join(folder_path, fig_name))

        plt.show()
```

### `classifiers.ipynb`

```python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.naive_bayes import GaussianNB
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
import os
import pickle

file_list = ['S006.csv','S008.csv','S009.csv','S010.csv','S012.csv','S013.csv','S014.csv','S015_fix.csv','S016.csv',
         'S017.csv','S018.csv','S019.csv','S020.csv','S021_fix.csv','S022.csv','S023_fix.csv','S024.csv','S025.csv',
         'S026.csv','S027.csv','S028.csv','S029.csv',]

def get_classifier(option):
    if option == 1:
        classifier = MLPClassifier(max_iter=500)
    elif option == 2:
        classifier = RandomForestClassifier(n_estimators=100, criterion='entropy', random_state=42)
    elif option == 3:
        classifier = GaussianNB()
    else:
        raise ValueError('Invalid option')

    return classifier

# 1: Neural Network
# 2: Random Forest
# 3: Bayesian Network

models_train_acc = []
models_test_acc = []
models_precisions = []
models_recalls = []
models_f1s = []

for number in range(1, 4):
    option = number
    train_acc = []
    test_acc = []
    precisions = []
    recalls = []
    f1s = []
    for i, file in enumerate(file_list):
        df = pd.read_csv(os.path.join('harth/', file))
        df = df.drop('timestamp', axis = 1)

        X = df.drop(['label'], axis = 1)
        Y = df['label']

        X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.3)

        clf = get_classifier(option)
        clf = clf.fit(X_train, Y_train)
        predictions = clf.predict(X_test)

        print(f"Classifier {option} yields training accuracy for file {file} of {clf.score(X_train,Y_train)} with a testing accuracy of {accuracy_score(Y_test, predictions)}")

        train_acc.append(clf.score(X_train,Y_train))
        test_acc.append(accuracy_score(Y_test, predictions))
        precisions.append(precision_score(Y_test, predictions, average='macro'))
        recalls.append(recall_score(Y_test, predictions, average='macro'))
        f1s.append(f1_score(Y_test, predictions, average='macro'))

    models_train_acc.append(np.mean(train_acc))
    models_test_acc.append(np.mean(test_acc))
    models_precisions.append(np.mean(precisions))
    models_recalls.append(np.mean(recalls))
    models_f1s.append(np.mean(f1s))

fig = plt.figure("Classification Results")
x_axis = np.arange(len(models_train_acc))
plt.bar(x_axis-0.2, models_train_acc, 0.4, label = "Train set")
plt.bar(x_axis+0.2, models_test_acc, 0.4, label = 'Test Set')
plt.xticks(x_axis)
plt.xlabel("Models")
plt.ylabel("Accuracy")
plt.legend()
plt.show()

fig = plt.figure("Classification Results")
x_axis = np.arange(len(models_train_acc))
plt.bar(x_axis-0.4, models_test_acc, 0.2, label = "Accuracy")
plt.bar(x_axis-0.2, models_precisions, 0.2, label = 'Precision')
plt.bar(x_axis, models_recalls, 0.2, label = 'Recall')
plt.bar(x_axis+0.2, models_f1s, 0.2, label = 'F1')
plt.xticks(x_axis)
plt.xlabel("Models")
plt.ylabel("Accuracy")
plt.legend()
plt.show()
```

### `clustering.ipynb`

```python
import pandas as pd
import numpy as np
import os
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
from sklearn.cluster import DBSCAN

file_list = ['S006.csv','S008.csv','S009.csv','S010.csv','S012.csv','S013.csv','S014.csv','S015_fix.csv','S016.csv',
         'S017.csv','S018.csv','S019.csv','S020.csv','S021_fix.csv','S022.csv','S023_fix.csv','S024.csv','S025.csv',
         'S026.csv','S027.csv','S028.csv','S029.csv',]

df_combined = pd.DataFrame()

for file in file_list:
    df = pd.read_csv(os.path.join('harth/', file))
    df_combined = pd.concat([df_combined, df])

df_combined = df_combined.drop('label', axis=1)

data = df_combined
data.drop(['timestamp'], axis=1, inplace=True)

scaler = StandardScaler()
data_scaled = scaler.fit_transform(data)

kmeans = KMeans(n_clusters=5, random_state=42)
clusters = kmeans.fit_predict(data_scaled)

pca = PCA(n_components=2)
principal_components = pca.fit_transform(data_scaled)

plt.figure()
plt.scatter(principal_components[:, 0], principal_components[:, 1], c=clusters, cmap='plasma', alpha=0.5)
plt.title('KMeans Clustering')
plt.colorbar()
plt.show()

df = pd.read_csv(os.path.join('harth/', file_list[7]))
df = df.drop(['timestamp', 'label'], axis = 1)

scaler = StandardScaler()
data_scaled = scaler.fit_transform(df.head(10000))

dbscan = DBSCAN(eps=1, min_samples=10)
clusters = dbscan.fit_predict(data_scaled)

plt.scatter(data_scaled[:, 0], data_scaled[:, 1], c=clusters, cmap='plasma', alpha=0.5)
plt.title('DBSCAN Clustering')
# plt.colorbar()
plt.show()
```
