---
title: Applied ML and Information Retrieval Pipelines
date: 2026-05-03
template: page
slug: projects/applied-ml-ir-pipelines
description: Unified project writeup for human activity recognition, clustering, semantic document search, TF-IDF ranking, and ColBERT comparison.
---

## Overview

This project combines two university data science assignments into one applied systems case study. One module works with wearable sensor data from the HARTH dataset to classify human activities and explore unsupervised clustering. The other builds a document retrieval engine over a text collection using preprocessing, an inverted index, TF-IDF weighting, cosine similarity ranking, and ColBERT comparison.

The goal was not only to train models, but to compare complete pipelines: how different data types are cleaned, represented, modeled, ranked, and evaluated. Together, the modules show the same engineering discipline applied across structured numerical signals and unstructured text.

## Module A: Human Activity Recognition

The activity-recognition module uses wearable sensor readings from back and thigh accelerometers. It includes exploratory analysis, feature inspection, supervised classification, and unsupervised clustering.

Key steps:

- Combined and cleaned participant CSV files.
- Removed non-informative index columns.
- Analyzed sensor distributions, waveform behavior, and feature correlations.
- Trained and compared MLP, Random Forest, and Gaussian Naive Bayes classifiers.
- Evaluated classification performance with accuracy, precision, recall, and F1.
- Compared KMeans and DBSCAN clustering after scaling and PCA projection.

Notable results:

- Random Forest achieved the highest mean test accuracy, around 0.932, but showed clear overfitting due to near-perfect training accuracy.
- MLP had slightly lower mean test accuracy, around 0.920, but generalized more consistently.
- KMeans produced clearer clusters than DBSCAN for this dataset.

## Module B: Information Retrieval

The retrieval module implements a classical search pipeline and compares it with ColBERT outputs. It covers the full retrieval loop: parsing documents and queries, preprocessing text, indexing, ranking, relevance comparison, and per-query visualization.

Key steps:

- Parsed document, query, and relevance collections.
- Applied stopword removal and Porter stemming.
- Built an inverted index from preprocessed terms.
- Implemented vector-space retrieval with TF-IDF weighting.
- Ranked documents by cosine similarity.
- Compared vector-space model variants with ColBERT results.
- Evaluated retrieval quality with precision-recall curves and mean average precision.

## Reports

- [Human activity recognition report](/reports/Project_HumanActivityRecognition_Report.pdf)
- [Information retrieval report](/reports/Project_InfoRetrieval_Report.pdf)
