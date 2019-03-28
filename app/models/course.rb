class Course < ActiveRecord::Base
	has_many :enrollments
	has_many :users, through: :enrollments
	belongs_to :teacher
	accepts_nested_attributes_for :teacher
	validates :name, presence: true
	validates :teacher_id, presence: true
	validates :description, presence: true
	validates :description, length: { minimum: 10 }
	validates :description, length: { maximum: 500 }
	validates :name, uniqueness: true

	scope :id_check, -> (courseid) { where("id == ? ", courseid)}
    

	def teacher_name
		teacher = Teacher.id_check(self.teacher_id)
		if teacher == []
			self.teacher_id = 10
			self.save
			return "No Teacher Yet"
		else 
	    	teacher[0].name
		end
	end

	 def teacher_id_check
		teacher = Teacher.id_check(self.teacher_id)
		if teacher == []
			self.teacher_id = 10
			self.save
			return 10
		else 
	    	teacher[0].id
		end
	end 

	def self.enrollment_check(user)
		allcourses = self.all

		allcourses.map do |course|
		course if !course.users.include?(user)

		end

	end


end