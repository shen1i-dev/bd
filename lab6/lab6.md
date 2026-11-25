# Звіт з лабораторної роботи №6

## Загальна інформація
- ПІБ студента: Кравчук Владислав Вікторович
- Група:ІПЗ-31
- Рівень виконання:2

## 1 Рівень

### Створення бази даних
1. Створити БД library.
```
use library
```
![](screenshots/1.png)

2. Створити колекції books, authors, users.
```
db.createCollection("books")
db.createCollection("authors")
db.createCollection("users")
```
![](screenshots/2.png)

3. Перевірити створену структуру.
```
show collections
```
![](screenshots/3.png)

### Наповнення колекцій

1. Додати 10 документів у books.
```
db.books.insertMany([
  { title: "Кобзар", author: "Тарас Шевченко", category: "Поезія", year: 1840, price: 250 },
  { title: "Лісова пісня", author: "Леся Українка", category: "Драма", year: 1911, price: 320 },
  { title: "Тигролови", author: "Іван Багряний", category: "Роман", year: 1944, price: 280 },
  { title: "Захар Беркут", author: "Іван Франко", category: "Історичний роман", year: 1883, price: 300 },
  { title: "Місто", author: "Валер'ян Підмогильний", category: "Роман", year: 1928, price: 350 },
  { title: "Енеїда", author: "Іван Котляревський", category: "Поема", year: 1798, price: 270 },
  { title: "Чорна рада", author: "Пантелеймон Куліш", category: "Історичний роман", year: 1857, price: 290 },
  { title: "Кайдашева сім'я", author: "Іван Нечуй-Левицький", category: "Повість", year: 1879, price: 310 },
  { title: "Intermezzo", author: "Михайло Коцюбинський", category: "Новела", year: 1908, price: 220 },
  { title: "Украдене щастя", author: "Іван Франко", category: "Драма", year: 1893, price: 260 }
])
```
![](screenshots/4.png)

2. Додати 10 документів у authors.
```
db.authors.insertMany([
  { name: "Тарас Шевченко", country: "Україна", birthYear: 1814 },
  { name: "Леся Українка", country: "Україна", birthYear: 1871 },
  { name: "Іван Франко", country: "Україна", birthYear: 1856 },
  { name: "Іван Багряний", country: "Україна", birthYear: 1906 },
  { name: "Валер'ян Підмогильний", country: "Україна", birthYear: 1901 },
  { name: "Іван Котляревський", country: "Україна", birthYear: 1769 },
  { name: "Пантелеймон Куліш", country: "Україна", birthYear: 1819 },
  { name: "Іван Нечуй-Левицький", country: "Україна", birthYear: 1838 },
  { name: "Михайло Коцюбинський", country: "Україна", birthYear: 1864 },
  { name: "Ольга Кобилянська", country: "Україна", birthYear: 1863 }
])
```
![](screenshots/5.png)

3. Додати 10 документів у users.
```
db.users.insertMany([
  { name: "Андрій", email: "andrii@gmail.com", age: 20 },
  { name: "Олена", email: "olena@gmail.com", age: 22 },
  { name: "Максим", email: "maksym@gmail.com", age: 19 },
  { name: "Ірина", email: "iryna@gmail.com", age: 25 },
  { name: "Дмитро", email: "dmytro@gmail.com", age: 21 },
  { name: "Марія", email: "maria@gmail.com", age: 23 },
  { name: "Олександр", email: "oleksandr@gmail.com", age: 24 },
  { name: "Софія", email: "sofia@gmail.com", age: 18 },
  { name: "Владислав", email: "vladyslav@gmail.com", age: 20 },
  { name: "Наталія", email: "nataliia@gmail.com", age: 27 }
])
```
![](screenshots/6.png)

4. Використати вкладені документи та масиви.
```
db.books.updateMany(
  {},
  {
    $set: {
      publisher: {
        name: "Українська книга",
        city: "Київ"
      },
      tags: ["українська література", "класика"]
    }
  }
)

db.users.updateMany(
  {},
  {
    $set: {
      favoriteCategories: ["Роман", "Поезія"]
    }
  }
)
```
![](screenshots/7.png)

5. Перевірити кількість документів.
```
db.books.countDocuments()
db.authors.countDocuments()
db.users.countDocuments()
```
![](screenshots/8.png)

### CRUD - створення та читання

1. insertOne() - додавання одного документа.
```
db.books.insertOne({
  title: "Тіні забутих предків",
  author: "Михайло Коцюбинський",
  category: "Повість",
  year: 1911,
  price: 330
})
```
![](screenshots/9.png)
2. insertMany() - додавання декількох документів.
```
db.books.insertMany([
  {
    title: "Маруся",
    author: "Григорій Квітка-Основ'яненко",
    category: "Повість",
    year: 1834,
    price: 240
  },
  {
    title: "Сон",
    author: "Тарас Шевченко",
    category: "Поема",
    year: 1844,
    price: 210
  }
])
```
![](screenshots/10.png)

3. find() - пошук документів.
```
db.books.find()
```
![](screenshots/11.png)

4. Пошук за рівністю та умовами порівняння.
```
db.books.find({ category: "Роман" })
db.books.find({ price: { $gt: 250 } })
db.books.find({ year: { $gt: 1900 } })
```
![](screenshots/12.png)

5. Використання логічних операторів.
```
db.books.find({
  $and: [
    { category: "Роман" },
    { price: { $gt: 250 } }
  ]
})

db.books.find({
  $or: [
    { category: "Поезія" },
    { category: "Драма" }
  ]
})
```
![](screenshots/13.png)

### CRUD - оновлення та видалення

1. updateOne() - оновлення одного документа.
```
db.books.updateOne(
  { title: "Кобзар" },
  { $set: { price: 280 } }
)
```
![](screenshots/14.png)

2. updateMany() - оновлення декількох документів.
```
db.books.updateMany(
  { price: { $lt: 250 } },
  { $set: { category: "Недорога література" } }
)
```
![](screenshots/15.png)

3. $set - зміна значень полів.
```
db.books.updateOne(
  { title: "Кобзар" },
  { $set: { pages: 320 } }
)
```
![](screenshots/16.png)

4. deleteOne() та deleteMany() - видалення за умовами.
```
db.users.deleteOne({
  email: "nataliia@gmail.com"
})

db.books.deleteMany({
  price: { $lt: 220 }
})
```
![](screenshots/17.png)

### Створення індексів

1. Створити три різних індекси.
```
db.books.createIndex({ title: 1 })
db.books.createIndex({ price: 1 })
db.books.createIndex({ category: 1 })
```
![](screenshots/18.png)

2. Переглянути створені індекси.
```
db.books.getIndexes()
```
![](screenshots/19.png)

3. Перевірити їх використання.
```
db.books.find({
  title: "Кобзар"
}).explain("executionStats")
```
![](screenshots/20.png)

### Порівняння продуктивності

1. Виконати запит без індексу.
```
db.books.find(
  { title: "Кобзар" }
).hint({ $natural: 1 })
```
![](screenshots/21.png)

2. Виконати аналогічний запит з індексом.
```
db.books.find(
  { title: "Кобзар" }
).hint({ title: 1 })
```
![](screenshots/22.png)

3. Використати explain("executionStats").
```
db.books.find(
  { title: "Кобзар" }
).hint({ $natural: 1 }).explain("executionStats")
```
![](screenshots/23.png)

4. Порівняти результати виконання.
```
Показник	                 Без індексу	             З індексом
Тип пошуку	                 COLLSCAN	                 IXSCAN + FETCH
Знайдено документів	         1	                         1
Перевірено документів	     12	                         1
Перевірено ключів індексу	 0	                         1
Час виконання	             276 мкс                   	 350 мкс
```

## 2 Рівень

### Складні запити

1. $and - одночасне виконання умов.
```
db.books.find({
  $and: [
    { category: "Роман" },
    { price: { $gt: 250 } }
  ]
})
```
![](screenshots/24.png)

2. $or - виконання хоча б однієї умови.
```
db.books.find({
  $or: [
    { category: "Драма" },
    { category: "Поезія" }
  ]
})
```
![](screenshots/25.png)

3. $in - пошук серед заданих значень.
```
db.books.find({
  price: { $in: [250, 280, 300, 320] }
})
```
![](screenshots/26.png)

4. $regex - пошук за шаблоном тексту.
```
db.books.find({
  title: { $regex: "а", $options: "i" }
})
```
![](screenshots/27.png)

### Агрегаційні запити

1. Підрахувати кількість книг за категоріями.
```
db.books.aggregate([
  {
    $group: {
      _id: "$category",
      totalBooks: { $sum: 1 }
    }
  }
])
```
![](screenshots/28.png)

2. Обчислити середні значення.
```
db.books.aggregate([
  {
    $group: {
      _id: null,
      averagePrice: { $avg: "$price" }
    }
  }
])
```
![](screenshots/29.png)

3. Згрупувати результати.
```
db.books.aggregate([
  {
    $group: {
      _id: "$year",
      booksCount: { $sum: 1 },
      averagePrice: { $avg: "$price" }
    }
  }
])
```
![](screenshots/30.png)

4. Відсортувати результати.
```
db.books.aggregate([
  {
    $group: {
      _id: "$category",
      totalBooks: { $sum: 1 }
    }
  },
  {
    $sort: { totalBooks: -1 }
  }
])
```
![](screenshots/31.png)

5. Використати етапи $match, $group, $sort, $avg, $count.
```
db.books.aggregate([
  {
    $match: {
      price: { $gt: 200 }
    }
  },
  {
    $group: {
      _id: "$category",
      averagePrice: { $avg: "$price" },
      totalBooks: { $sum: 1 }
    }
  },
  {
    $sort: {
      averagePrice: -1
    }
  }
])

db.books.aggregate([
  {
    $match: {
      price: { $gt: 200 }
    }
  },
  {
    $count: "totalBooks"
  }
])
```
![](screenshots/32.png)

### Складені індекси

1. Створити compound index.
```
db.books.createIndex({
  category: 1,
  price: 1
})
```
![](screenshots/33.png)

2. Використати декілька полів для індексування.
```
db.books.getIndexes()
```
![](screenshots/34.png)

3. Перевірити його роботу на складному запиті.
```
db.books.find({
  category: "Роман",
  price: { $gt: 250 }
}).hint({
  category: 1,
  price: 1
}).explain("executionStats")
```
![](screenshots/35.png)

### Текстовий пошук

1. Створити індекс типу text.
```
db.books.createIndex({
  title: "text",
  author: "text"
})
```
![](screenshots/36.png)

2. Виконати пошук за словами.
```
db.books.find({
  $text: {
    $search: "Кобзар"
  }
})
```
![](screenshots/37.png)

3. Перевірити знайдені документи.
```
db.books.find(
  { $text: { $search: "Кобзар" } },
  {
    _id: 0,
    title: 1,
    author: 1,
    category: 1
  }
)
```
![](screenshots/38.png)

### Об'єднання колекцій через $lookup

1. Об'єднати дані книг та авторів.
```
db.books.aggregate([
  {
    $lookup: {
      from: "authors",
      localField: "author",
      foreignField: "name",
      as: "authorInfo"
    }
  }
])
```
![](screenshots/39.png)

2. Отримати інформацію з двох колекцій в одному запиті.
```
db.books.aggregate([
  {
    $lookup: {
      from: "authors",
      localField: "author",
      foreignField: "name",
      as: "authorInfo"
    }
  },
  {
    $project: {
      _id: 0,
      title: 1,
      category: 1,
      author: 1,
      authorInfo: 1
    }
  }
])
```
![](screenshots/40.png)

3. Переглянути результат об'єднання.
```
db.books.aggregate([
  {
    $lookup: {
      from: "authors",
      localField: "author",
      foreignField: "name",
      as: "authorInfo"
    }
  },
  {
    $unwind: "$authorInfo"
  },
  {
    $project: {
      _id: 0,
      title: 1,
      category: 1,
      author: "$authorInfo.name",
      country: "$authorInfo.country",
      birthYear: "$authorInfo.birthYear"
    }
  }
])
```
![](screenshots/41.png)

### Створення представлення (View)

1. Створити представлення для часто використовуваного запиту.
```
db.createView(
  "expensive_books",
  "books",
  [
    {
      $match: {
        price: { $gt: 250 }
      }
    }
  ]
)
```
![](screenshots/42.png)

2. Переглянути його вміст.
```
db.expensive_books.find()
```
![](screenshots/43.png)

3. Перевірити отримання даних через представлення.
```
db.expensive_books.find({
  category: "Роман"
})
```
![](screenshots/44.png)

## Висновки
Під час виконання лабораторної роботи я ознайомився з СУБД MongoDB та навчився створювати бази даних і колекції, додавати, шукати, змінювати та видаляти документи. Також я опрацював індекси, агрегаційні запити, текстовий пошук, об'єднання колекцій за допомогою $lookup та створення представлень (View). У результаті закріпив навички роботи з документними базами даних.