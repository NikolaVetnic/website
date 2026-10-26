---
title: Transfer Learning, Finding Learning Rate, and More
date: 2020-08-07
summary: Training a neural network from scratch is unnecessary in a situation when pretrained models are readily available.
tags: [code, deep learning]
---

_Training a neural network from scratch is unnecessary in a situation when pretrained models are readily available. This notebook showcases loading a pretrained model directly from pytorch.models subpackage, its subsequent re-training for the specific problem at hand, a method used to determine the optimal learning rate, ways of defining custom transforms and finally assembling several models into an ensemble._

![PyTorch_Article](main-qimg-fd9f8d4c4a8c1a857c0523c6d32d9c4d.jpg)

Once again, the examples are based on Chapter 4 of Ian Pointer’s [“Programming PyTorch for Deep Learning”](https://www.oreilly.com/library/view/programming-pytorch-for/9781492045342/), released by O’Reilly in 2019.

Jupyter notebook of the model may be found on GitHub: [https://tinyurl.com/yyzth69w](https://tinyurl.com/yyzth69w)

Also, the same notebook is available on Google Colab (where it can be tested it against the GPU available there): [https://tinyurl.com/y4rlnqfs](https://tinyurl.com/y4rlnqfs)
