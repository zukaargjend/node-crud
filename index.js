const mongoose = require('mongoose');

mongoose.connect('mongodb://0.0.0.0:27017/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
   name: {
       type: String,
       required: true,
       minLength: 5,
       maxLength: 255
   },
    category: {
       type: String,
       required: true,
        enum: ['web', 'network', 'mobile']
    },
   author: String,
   tags:  {
       type: Array,
       validate: {
           isAsync: true,
           validator: function (v) {
               return new Promise((resolve) => {
                   setTimeout(() => {
                       const result = v && v.length > 0;
                       resolve(result);
                   }, 4000);
               });
           },
           message: 'A course should have at least one tag.'
       }
    },
   date: { type: Date, default: Date.now },
   isPublished: Boolean,
    price: {
       type: Number,
        required: function () { return this.isPublished; }

    }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse(){
    const course = new Course({
        name: 'React.js Course',
        category: 'web',
        author: 'ZuKa',
        tags: [],
        isPublished: true,
        price: 15
    });

    try{
        const result = await course.save();
        console.log(result);
    }catch(ex){
        console.log(ex.message);
    }
}

createCourse();

async function getCourse(){
    //eq(equal)
    //ne(not equal)
    //gt(greater than)
    //gte(greater than or equal to)
    //lt(less than)
    //lte(less than or equal to)
    //in
    //nin(not  in)

    const courses = await Course
        .find({ author: 'ZuKa', isPublished: true})
        //.find({ price: { $gte: 10, $lte: 20 } })
        //.find({ price: { $in: [10, 15, 20] } })
        //Starts with ZuKa
        //.find({ author: /^ZuKa/ })

        //Ends with ZuKa
        //.find({ author: /ZuKa$/i })

        //Contains ZuKa
        //.find({ author: /.*ZuKa.*/i })
        .limit(10)
        .sort({ name: 1})
        //.select({ name: 1, tags: 1})
        .count();
    console.log(courses);
}

// async function updateCourse(id){
//     //Approach: Query first
//     //findById
//     //Modify its properties
//     //save()
//
//     const course = await Course.findById(id);
//     if(!course) return;
//
//     course.isPublished = true;
//     course.author = 'author';
//
//     const result = await course.save();
//     console.log(result);
// }
//
// updateCourse('6388af05f3c955d8261007f3');

async function updateCourse(id){
    //Approach: Query first
    //findById
    //Modify its properties
    //save()

    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'ZuKa',
            isPublished: false
        }
    }, { new: true});

    console.log(course);
}

//updateCourse('6388af05f3c955d8261007f3');

async function removeCourse(id){
    const result = await Course.deleteMany({ _id: id });
    const course = await Course.findByIdAndRemove(id);
    console.log(result);
}

// removeCourse('6388af05f3c955d8261007f3');


