# Answers
## Part 1
##### Question 1.1:
Looking at the page containing the table, what are the differences between the DOM as shown by the DOM inspector and the HTML source code? Why would you use the DOM inspector? When is the HTML source useful?
DOM инспектор предоставляет различные иструменты для дебага, это упрощает отладку.
##### Question 1.2:
Below we have partially reproduced the first lines from the table's dataset. What piece of software generates this table? Where are the original data stored?
Данные храняться в json, они выгружаются в массив(парсится при помощи библиотеки d3).
После формируются html тэги и добавляются в документ.
## Part 2
##### Question 2.1:
Would you filter other columns from the table the same way? E.g. would you use checkboxes or any other HTML widget?
Теоретически можно. Однако, для этого придется выделить четкий критерий по которому будут разделяться страны, если брать другой признак. Например, выделим две группы с малой продолжительностью жизни (до 42 лет) и с долгой продолжительностью (более 42). Можно будет аналогично создать два checkbox - а (more 42, less 42).
Однако в случае численных веречин более дружелюбным будет range, в котором можно будет самостоятельно устанавливать границу (просмотреть страны где продолжительность жизни больше n)
### Part 3
##### Question 3.1:
Could you aggregate the table using other columns? If you think yes, explain which ones and how you would group values. Which HTML widgets would be appropriate?
Да, ответ аналогичен 2.1. Если выделить критерий по которому мы можем раздедить страны на группы. Все зависит от того какую информацию мы хотим получить из данных.
Если мы хоти посмотреть иторичекие изменения в мире может быть полезно агреггировать по году. Radio button выглятит одним из самых элементов для аггрегации. Но никто не мешает использовать любой другой.
### Part 4
##### Question 4.1:
What does the new attribute years hold?
years - массив элементов { "gdp", "life_expectancy", "top_parents", "year", "population" }
### Part 5
##### Question 5.1:
What are the pros and cons of using HTML vs. SVG? Give some examples in the context of creating visualizations.
1) html - лучше при работе с текстом, svg - лучше в задачах визуализации
2) svg имеет больше возможностей для анимации
3) html - растровая графика, html - векторная
4) html имеет лучшую производительность при сравнительно малом разрешении
### Part 7
##### Question 7.1:
Give an example of a situation where visualization is appropriate, following the arguments discussed in lecture and in the textbook (the example cannot be the same as mentioned in either lecture or textbook).
Воспринятие информации может быть затруднено большим объемом, обощенностью высказаваний, запутанностю терминов. Визуализация призвана упростить воспринятие информации. Самый простой пример позволяющий понять работу сортировок https://proglib.io/p/sort-gif/.
##### Question 7.2:
Which limitations of static charts can you solve using interactivity?
1) динамика развития процесса
2) динамика может позволить показать более емко больше информации. Например можно организовать фильтрацию или переходы от одного подмножества данных к другому
##### Question 7.3:
What are the limitations of visualization?
Хорошая визуализация как правила требует, предварительной классификации данных или организации их в структуру. Визуализация плохих неструктурированных данных, особенного если их много, может запутать не меньше чем изучение самого набора дыннх.
Возможно выявление ложных зависимостей или не возможность выявление зависимостей вообще при анализе данных основываясь только на анализе графичеких образов. 
##### Question 7.4:
Why are data semantics important for data?
Только в зависимости от контекста можно определить корректный результат.
В зависимости от цели можно выбрать интересные данные.
##### Question 7.5:
Which relationships are defined for two attributes of (a) quantitative, (b) categorical, or (c) ordinal scale?
a - возможно сранить, вычислить сумму, медиану и прочие величины
b - сгруппировать, сортировать, выбрать только некоторые
c - отсортировать, сгруппировать
##### Question 7.6:
Which visual variables are associative (i.e., allow grouping)?
Категориальные данные,
если данные можно разделить на группы, например страны по континентам, людей в зависимости от пола или рассе
##### Question 7.7:
Which visual variables are quantitative (i.e., allow to judge a quantitative difference between two data points)?
Данные имеющие численную величену. Можно оценить разницу между такими данными по отношению к единичному значению. Рост или вес человека, количестово человек проживающих в стране, площадь.