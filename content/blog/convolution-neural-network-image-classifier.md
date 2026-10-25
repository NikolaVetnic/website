---
title: Convolution Neural Network Image Classifier
date: 2020-08-07
summary: Following the initial image classifier built using the feed-forward architecture the convolution neural networks are the next step on the quest of surpassing human-level accuracy.
tags: [code, deep learning]
---

Following the initial image classifier built using the feed-forward architecture the convolution neural netw_orks are the next step on the quest of surpassing human-level accuracy. In essence, the nodes making up the layers of CNNs are not fully connected with nodes adjacent to them, but are rather divided into distinct sets covered by the filter, or the convolution kernel (hence the name)._

![PyTorch_Article](main-qimg-fd9f8d4c4a8c1a857c0523c6d32d9c4d.jpg)

Such an approach allows the network to “compress” tensors and thus extract and (hopefully) learn important details about the images it is trying to classify. In result the network is both more accurate and also faster to train from the get-go. Also, it’s important to mention that the CNN in this case is actually AlexNet, historically important first network that attempted to classify images as described.

In case you’re interested in an entry level PyTorch deep learning textbook I wholeheartedly recommend the following book by Ian Pointer: [https://tinyurl.com/y269xn26](https://tinyurl.com/y269xn26)

Jupyter notebook of the model may be found on GitHub: [https://tinyurl.com/y467epf9](https://tinyurl.com/y467epf9)

Also, the same notebook is available on Google Colab (where it can be tested it against the GPU available there): [https://tinyurl.com/y3faorp8](https://tinyurl.com/y3faorp8)
