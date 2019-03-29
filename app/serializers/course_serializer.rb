class CourseSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :teacher_id
  belongs_to :teacher 
end
