import React from 'react'

import './AddStudent.css'

function AddStudent() {
  return (
    <div className='add-student'>
      <div className='card border-0  rounded-3 my-5 add-student-card'>
        <div className='card-body p-4 p-sm-5 student-card-body'>
          <h3 className='card-title text-center mb-3  fs-3'>Adauga Student</h3>
          <form className='add-student-form' novalidate>
            <div className='student-email-and-name'>
              <div className='form-floating mb-3'>
                <input
                  type='email'
                  className='form-control'
                  id='floatingStudentEmail'
                  placeholder='nume.prenume@student.usv.ro'
                />
                <label htmlFor='floatingStudentEmail'>Email</label>
                <div className='invalid-feedback add-student-valid-feedback'>
                  Exista deja un student cu acest email
                </div>
              </div>

              <div className='form-floating mb-3'>
                <input
                  type='text'
                  className='form-control'
                  id='floatingStudentName'
                  placeholder='Nume inițiala-tată prenume'
                />
                <label htmlFor='floatingStudentName'>Nume complet</label>
                <div
                  className='invalid-feedback add-student-valid-feedback'
                  style={{ visibility: 'hidden' }}
                >
                  Ceva
                </div>
              </div>
            </div>
            <div className='form-floating mb-3'>
              <input
                type='text'
                className='form-control'
                id='floatingStudentDomain'
                placeholder='Domeniu de studii'
              />
              <label htmlFor='floatingStudentDomain'>Domeniu de studii</label>
            </div>
            <div className='form-floating mb-3'>
              <input
                type='text'
                className='form-control'
                id='floatingStudentDomain'
                placeholder='Program de studii'
              />
              <label htmlFor='floatingStudentProgram'>Program de studii</label>
            </div>
            <div className='student-cycle-and-year'>
              <div class='form-floating'>
                <select
                  class='form-select'
                  id='floatingStudentCycle'
                  aria-label='Ciclu de studii'
                >
                  <option selected>Selecteaza...</option>
                  <option value='licenta'>Licenta</option>
                  <option value='masterat'>Masterat</option>
                  <option value='studii postuniversitare'>Postuniv.</option>
                  <option value='conversie profesionala'>Conv. prof.</option>
                </select>
                <label for='floatingStudentCycle'>Ciclu de studii</label>
              </div>
              <div class='form-floating'>
                <select
                  class='form-select'
                  id='floatingStudentYear'
                  aria-label='An studiu'
                >
                  <option selected>Selecteaza...</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
                <label for='floatingStudentYear'>An studiu</label>
              </div>
            </div>
            <div className='student-finan-educform-sex'>
              <div class='form-floating'>
                <select
                  class='form-select'
                  id='floatingStudentEducForm'
                  aria-label='Formă de învățămant'
                >
                  <option selected>Selecteaza...</option>
                  <option value='IF'>IF</option>
                  <option value='ID'>ID</option>
                </select>
                <label for='floatingStudentEducForm'>Formă de învățămant</label>
              </div>
              <div class='form-floating'>
                <select
                  class='form-select'
                  id='floatingStudentFinan'
                  aria-label='Finanțare'
                >
                  <option selected>Selecteaza...</option>
                  <option value='buget'>Buget</option>
                  <option value='taxă'>Taxă</option>
                </select>
                <label for='floatingStudentFinan'>Finanțare</label>
              </div>
              <div class='form-floating'>
                <select
                  class='form-select'
                  id='floatingStudentSex'
                  aria-label='Sex'
                >
                  <option selected>Selecteaza...</option>
                  <option value='M'>M</option>
                  <option value='F'>F</option>
                </select>
                <label for='floatingStudentSex'>Sex</label>
              </div>
            </div>
            <hr className='my-4' />
            <div className='d-grid div-btn-add-student'>
              <button
                className='btn btn-primary fw-bold btn-add-student'
                type='button'
              >
                Adauga
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddStudent
